/**
 * @module smart-auth
 * @beta
 * 
 * A Fastify plugin to support the SMART App Authorization response code authorization OAuth 2.0 flow and wrapping the simple-oauth2 library.
 */

import { randomBytes } from "crypto";
import { AccessToken, AuthorizationCode } from "simple-oauth2";
import { FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import fastifyPlugin from "fastify-plugin";

export type SmartAuthProvider = {
  /** A name to label the provider */
  name: string;
  /** @todo this could be typed to the FHIR spec */
  scope: string[];
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
    /** String used to set the host to request the tokens to. Required. */
    tokenHost: string;
    /** String path to request an access token. Default to /oauth/token. */
    tokenPath?: string;
    /** String path to revoke an access token. Default to /oauth/revoke. */
    revokePath?: string;
    /** String used to set the host to request an "authorization code". Default to the value set on auth.tokenHost. */
    authorizeHost?: string;
    /** String path to request an authorization code. Default to /oauth/authorize. */
    authorizePath?: string;
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
    request: FastifyRequest<{Querystring: { code: string, state: string }}>,
  ): Promise<AccessToken>;

  getNewAccessTokenUsingRefreshToken(
    refreshToken: string,
    params: Record<string, any>
  ): Promise<AccessToken>;

  generateAuthorizationUri(
    request: FastifyRequest,
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

const defaultState = randomBytes(10).toString('hex')

function generateState(): string {
  return defaultState;
}

function checkState(state: string) {
  if (state === defaultState) return

  new Error('Invalid state')
}

const oauthPlugin: FastifyPluginCallback<SmartAuthProvider> = function (http, options, next) {
  const { name, auth, client, scope, redirect } = options

  const prefix                = auth?.pathPrefix || "/smart";
  const tokenHost             = auth.tokenHost;
  const authorizeParams       = auth?.authorizeParams || {}
  const authorizeRedirectPath = `${prefix}/${name.toLowerCase()}/auth`
  const redirectPath          = redirect.path || `${prefix}/${name.toLowerCase()}/redirect`
  const redirectUri           = `${redirect.host}${redirectPath}`

  function generateAuthorizationUri() {
    const state = generateState();
    const urlOptions = Object.assign({}, authorizeParams, {
      redirect_uri: redirectUri,
      scope,
      state
    })

    const authorizationUri = authorizationCodeFlow.authorizeURL(urlOptions)
    return authorizationUri
  }

  function startRedirect(_request: FastifyRequest, reply: FastifyReply) {
    const authorizationUri = generateAuthorizationUri()

    reply.redirect(authorizationUri);
  }

  async function getAccessTokenFromAuthorizationCodeFlow(this: SmartAuthNamespace, request: FastifyRequest<{Querystring: { code: string, state: string }}>) {
    const { code, state } = request.query;

    checkState(state);

    return await this.authorizationCodeFlow.getToken({
      code: code,
      redirect_uri: redirectUri
    })
  }

  async function getNewAccessTokenUsingRefreshToken(this: SmartAuthNamespace, refreshToken: string): Promise<AccessToken> {
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

export default fastifyPlugin(oauthPlugin, {
  name: "smart-auth"
})