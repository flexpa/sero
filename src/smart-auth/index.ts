/**
 * @module smart-auth
 * @beta
 * 
 * A Fastify plugin to support the SMART App Authorization response code authorization OAuth 2.0 flow and wrapping the simple-oauth2 library.
 */

import { randomBytes } from "crypto";
import { AccessToken, AuthorizationCode, ClientCredentials } from "simple-oauth2";
import { FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import fastifyPlugin from "fastify-plugin";
// @todo this should come from @types/fhir - and specifically fhir3.FhirResourceList but it 
// hasn't been released yet - we use our deprecated enum
import FHIRResourceList from "../resources";

type LaunchContext = "launch" | "launch/patient"
type Profile = "openid" | "fhirUser" | "profile"
type Refresh = "online_access" | "offline_access"
type Resources = `${"patient" | "user"}/${FHIRResourceList | "*"}.${"read" | "write" | "*"}`

export type SmartAuthScope = LaunchContext | Profile | Refresh | Resources

export type SmartAuthProvider = {
  /** A name to label the provider */
  name: string;
  scope: SmartAuthScope[];
  /** Client registration */
  client: {
    id: string;
    secret: string;
  }
  /** Auth related config */
  auth: {
    /** An optional prefix to add to every route path */
    pathPrefix?: string;
    /** Optional params to append to the authorization redirect */
    authorizeParams?: Record<string, any>;
    /** String used to set the host to request an "authorization code". Default to the value set on auth.tokenHost. */
    authorizeHost?: string;
    /** String path to request an authorization code. Default to /oauth/authorize. */
    authorizePath?: string;
    /** Optional params to post to the token exchange */
    tokenParams?: Record<string, any>;
    /** String used to set the host to request the tokens to. Required. */
    tokenHost: string;
    /** String path to request an access token. Default to /oauth/token. */
    tokenPath?: string;
    /** String path to revoke an access token. Default to /oauth/revoke. */
    revokePath?: string;
  };
  redirect: {
    /** A required host name for the auth code exchange redirect path. */
    host: string;
    /** An optional authorize path override. */
    path?: string;
  };
  /** The default host name for the authorization service. Used to redirect users to the authorization URL. */
  iss: string;
}

export interface SmartAuthNamespace {
  authorizationCodeFlow: AuthorizationCode;

  getAccessTokenFromAuthorizationCodeFlow(
    request: FastifyRequest<SmartAuthRedirectQuerystring>,
  ): Promise<AccessToken>;

  getAccessTokenFromClientCredentialFlow(
    smartAuthProvider: SmartAuthProvider,
    scope?: string[],
  ): Promise<AccessToken>;

  getNewAccessTokenUsingRefreshToken(
    refreshToken: string,
    params: Record<string, any>
  ): Promise<AccessToken>;

  generateAuthorizationUri(
    scope?: SmartAuthScope[],
  ): string;
}

export const SmartAuthRedirectQuerystringSchema = {
  schema: {
    querystring: {
      code: { type: 'string' },
      state: { type: 'string', }
    }
  }
}

export interface SmartAuthRedirectQuerystring {
  Querystring: {
    code: string,
    state: string
  }
}

export interface SmartAuthUrlQuerystring {
  Querystring?: {
    scope?: SmartAuthScope[]
  }
} 

const defaultState = randomBytes(10).toString('hex')

function generateState(): string {
  return defaultState;
}

function checkState(state: string) {
  if (state === defaultState) return

  new Error('Invalid state')
}

function routeCase(value: string): string {
  return value.toLowerCase().replace(/\s/g,'-');
}

const oauthPlugin: FastifyPluginCallback<SmartAuthProvider> = function (http, options, next) {
  const { name, auth, client, scope: defaultScope, redirect } = options

  const prefix                = auth?.pathPrefix || "/smart";
  const tokenParams           = auth?.tokenParams || {}
  const tokenHost             = auth.tokenHost;
  const authorizeParams       = auth?.authorizeParams || {}
  const authorizeRedirectPath = `${prefix}/${routeCase(name)}/auth`
  const redirectPath          = redirect.path || `${prefix}/${routeCase(name)}/redirect`
  const redirectUri           = `${redirect.host}${redirectPath}`

  function generateAuthorizationUri(scope?: SmartAuthScope[]) {
    const state = generateState();
    const urlOptions = Object.assign({}, authorizeParams, {
      redirect_uri: redirectUri,
      scope: scope || defaultScope,
      state
    })

    const authorizationUri = authorizationCodeFlow.authorizeURL(urlOptions)
    return authorizationUri
  }

  function startRedirect(
    request: FastifyRequest<SmartAuthUrlQuerystring>,
    reply: FastifyReply
  ) {
    const authorizationUri = generateAuthorizationUri(request?.query?.scope)

    reply.redirect(authorizationUri);
  }

  async function getAccessTokenFromAuthorizationCodeFlow(
    this: SmartAuthNamespace,
    request: FastifyRequest<SmartAuthRedirectQuerystring>
  ): Promise<AccessToken> {
    const { code, state } = request.query;

    checkState(state);

    const params = Object.assign({}, tokenParams, {
      code: code,
      redirect_uri: redirectUri
    })

    return await this.authorizationCodeFlow.getToken(params)
  }

  async function getNewAccessTokenUsingRefreshToken(
    this: SmartAuthNamespace,
    refreshToken: string
  ): Promise<AccessToken> {
    return await this.authorizationCodeFlow.createToken({ refresh_token: refreshToken }).refresh()
  }

  const authCodeOptions = {
    client,
    auth: {
      tokenPath: auth?.tokenPath,
      revokePath: auth?.revokePath,
      authorizeHost: auth?.authorizeHost,
      authorizePath: auth?.authorizePath,
      tokenHost
    }
  }

  const authorizationCodeFlow = new AuthorizationCode(authCodeOptions)

  http.get(authorizeRedirectPath, startRedirect)

  try {
    http.decorate(name, {
      authorizationCodeFlow,
      getAccessTokenFromAuthorizationCodeFlow,
      getNewAccessTokenUsingRefreshToken,
      generateAuthorizationUri
    })


  } catch (e) {
    next(e as Error)
    return
  }  

  next();
}

export const getAccessTokenFromClientCredentialFlow = async (
  smartAuthProvider: SmartAuthProvider,
  scope?: string[]
): Promise<AccessToken | undefined> => {
  const clientCredentialsOptions = {
    client: smartAuthProvider.client,
    auth: {
      tokenPath: smartAuthProvider.auth?.tokenPath,
      tokenHost: smartAuthProvider.auth?.tokenHost
    },
  };

  const client = new ClientCredentials(clientCredentialsOptions);
  const tokenParams = {
    scope: scope || smartAuthProvider.scope,
  };

  try {
    return await client.getToken(tokenParams);
  } catch (error: any) {
    console.log('Access Token error', error.message);
  }
};

export default fastifyPlugin(oauthPlugin, {
  name: "smart-auth"
})