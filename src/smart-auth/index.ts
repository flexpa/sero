/**
 * @module smart-auth
 * @beta
 * 
 * A module that implements the SMART Auth response code flow as a server
 */

 import { randomBytes } from "crypto";
 import { AccessToken, AuthorizationCode, ModuleOptions } from "simple-oauth2";
 import { FastifyPlugin, FastifyReply, FastifyRequest } from "fastify";
 
 export type SmartAuthCredentials = ModuleOptions;
 
 export interface SmartAuthProvider {
   name: string;
   scope: string[]; // @todo
   credentials: SmartAuthCredentials;
   redirectPath?: string;
   redirectUri?: string;
   authorizePath?: string;
   authorizeParams?: Object; // @todo
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
 
 const oauthPlugin: FastifyPlugin<SmartAuthProvider> = function (http, options, next) {
   const { name, credentials, scope } = options
 
   const authorizeParams = options.authorizeParams || {}
   const authorizePath = options.authorizePath || `/smart/${name.toLowerCase()}/auth`
   const redirectPath = options.redirectPath || `/smart/${name.toLowerCase()}/callback`
   const redirectUri = options.redirectUri || `http://localhost:8080${redirectPath}`
 
   function Provider(): SmartAuthNamespace {
     // @ts-ignore
     return http[name];
   }
 
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
 
   async function getAccessTokenFromAuthorizationCodeFlow(request: FastifyRequest<{Querystring: { code: string, state: string }}>) {
     const { code, state } = request.query;
 
     checkState(state);
 
     return await Provider().authorizationCodeFlow.getToken({
       code: code,
       redirect_uri: redirectUri
     })
   }
 
   async function getNewAccessTokenUsingRefreshToken(refreshToken: string): Promise<AccessToken> {
     return await Provider().authorizationCodeFlow.createToken({ refresh_token: refreshToken }).refresh()
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
     next(e)
     return
   }
 
   next()
 }
 
 export default oauthPlugin