/**
 * @module smart-auth
 * @beta
 * 
 * A Fastify plugin to support the SMART App Authorization response code authorization OAuth 2.0 flow and wrapping the simple-oauth2 library.
 */

import { randomBytes } from "crypto";
import { AccessToken, AuthorizationCode, ModuleOptions } from "simple-oauth2";
import { FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import fastifyPlugin from "fastify-plugin";

export type SmartAuthCredentials = ModuleOptions;

export interface SmartAuthProvider {
  name: string;
  scope: string[]; // @todo this could be typed to the FHIR spec
  credentials: SmartAuthCredentials;
  redirectHost: string;
  redirectPath?: string; 
  authorizePath?: string;
  authorizeParams?: Object; // @todo
  prefix?: string;
}

export interface SmartAuthNamespace {
  authorizationCodeFlow: AuthorizationCode;

  getAccessTokenFromAuthorizationCodeFlow(
    request: FastifyRequest<{Querystring: { code: string, state: string }}>,
  ): Promise<AccessToken>;

  getNewAccessTokenUsingRefreshToken(refreshToken: string, params: Object): Promise<AccessToken>;

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
  const { name, credentials, scope, redirectHost } = options

  const prefix = options.prefix = "/smart";
  const authorizeParams = options.authorizeParams || {}
  const authorizePath = options.authorizePath || `${prefix}/${name.toLowerCase()}/auth`
  const redirectPath = options.redirectPath || `${prefix}/${name.toLowerCase()}/redirect`
  const redirectUri = `${redirectHost}${redirectPath}`

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

  const authorizationCodeFlow = new AuthorizationCode(credentials)

  http.get(authorizePath, startRedirect)

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