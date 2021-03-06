# smart-auth

A Fastify plugin to support the [SMART App Authorization](https://docs.smarthealthit.org/authorization/) response code authorization OAuth 2.0 flow and wrapping the `simple-oauth2` library.

* Fastify plugin architecture with the latest version of `simple-oauth2`
* Natively written in TypeScript
* Use it to securely build user flows that involve SMART Auth including Patient Access
* Works with any Smart Health ID provider (i.e. a CARIN BB 1.0 implementation)

## Install

Start a new project and install Sero and Fastify:

`npm i --save @sero.run/sero fastify`

## Usage

A TypeScript example:

```typescript
import {
  SmartAuth,
  SmartAuthProvider,
  SmartAuthRedirectQuerystring as Querystring,
  SmartAuthRedirectQuerystringSchema as QuerystringSchema
} from "@sero.run/sero"
import Fastify from "fastify";

// Let's create a new Fastify Server
const fastify = Fastify();

// Our Smart Health ID Provider config
const smartAuthProviderExample: SmartAuthProvider = {
  name: "idp",
  client: {
    id: "123",
    secret: "somesecret",
  },
  auth: {
    grantFlow: "authorization_code",
    scope: ["launch"],
    tokenHost: "http://external.localhost",
    authorizePath: "/smart/oauth/authorize",
    redirect: {
      host: "http://localhost:3000",
    }
  },
};

// Initialize the plugin with our Smart Health ID Provider config
fastify.register(SmartAuth, smartHealthIdConfig)

// The plugin decorates our Fastify instance so we need to tell TypeScript
declare module 'fastify' {
  interface FastifyInstance {
    smartHealthIdProvider: SmartAuthNamespace;
  }
}

// Lastly, we define a route that acts as the callback/redirect URL at the end of the response code authorization flow
fastify.get<Querystring>("/smart/smartHealthIdProvider/redirect", QuerystringSchema, async function (request, reply) {
  await this.smartHealthIdProvider.getAccessTokenFromAuthorizationCodeFlow(request)
  reply.send("Successfully connected");
})

fastify.listen(3000)
```

## Features

### SMART App Launch + Client Credentials

SMART Auth profiles can be configured for both the Authorization Code grant flow (i.e. standard SMART App Launch) and, separately, for the Client Credentials grant flow introduced in some SMART + FHIR systems even though it is not standard.

The rest of this document will assume the perspective of the SMART App Launch flow. See more config details in [Smart Health ID Provider Config](#Smart-Health-ID-Provider-Config). 

### Routes

By default, the above example in [Usage](#Usage) will scaffold an authorization URL from the `const smartAuthProviderExample` configuration object in this format:

`/{prefix}/{smartAuthProviderExample.name}/auth`

* Prefix by default is `smart` - you can customize in `const smartAuthProviderExample`
* `smartAuthProviderExample.name` is the id field of the config

For the above example in [Usage](#Usage) the authorization URL will be:

`/smart/smartHealthIdProvider/auth`

You can send users of your application to this route to initiate the auth code flow.

The redirect/callback route is your responsibility to define, like in the example above.

### Scopes

You can dynamically request [SMART Auth scopes](http://www.hl7.org/fhir/smart-app-launch/scopes-and-launch-context/) on a request level.

Per the above authorizational URL example, you can also pass additional per-request scope overrides via `scopes` in the query string:

`/{prefix}/{SmartAuthProvider.name}/auth?scope=launch`

For lists, like this:

```javascript
{
  scope: ["launch", "patient/Observation.read"]
}
```

You can encode it correctly with `new URLSearchParams`:

```
let querystring = new URLSearchParams({
  scope: ["launch", "patient/Observation.read"]
}).toString()
```

Which you can use to build the final URL:

`/{prefix}/{SmartAuthProvider.name}/auth?scope=launch%20patient%2FObservation.read`

Sero will pass your scoped parameters in its generated authorization URL for your request.

### Exports/Imports/Types

* `SmartAuth` is the Fastify plugin itself
* `SmartAuthScope` is the union of all possible scope values in the SMART Auth protocol
* `SmartAuthProvider` is a TS interface for the function namespace the plugin exposes back to you on the decorated server object (see decorators and functions below)
* `SmartAuthRedirectQuerystring` is a TS interface that types the Fastify route contraints for the redirect/callback url - see example for use
* `SmartAuthUrlQuerystring` is a TS interface that types the Fastify route contraints for the auto-generated authorization URL starting point described above. You can customize scopes on a per request basis.
* `SmartAuthRedirectQuerystringSchema` is the AJV schema definition that corresponds to `SmartAuthRedirectQuerystring`, and can be used in the Fastify runtime - see example for use
* `getAccessTokenFromClientCredentialFlow` is a function to fetch a `client_credential` access token for a given `SmartAuthProvider`. It will also prioritize the passed in `scope: string[]` over the `smartAuthProvider.scope`, in case you need special scope(s) for this flow. This function is not decorated on the fastify server, so it can be called directly on a `SmartAuthProvider`.
* `ClientCredentialsConfig` a TS interface that types the auth configuration for the Client Credentials grant flow inside of a `SmartAuthProvider`
* `AuthCodeConfig` is a TS interface that types the auth configuration for the Authorization Code grant flow inside of a `SmartAuthProvider`
* `GrantFlow` is a TS union type for `"authorization_code"` and `"client_credentials"`

### Decorators

The plugin uses Fastify decorators to provide you with a call-able interface on your fastify server object.

The `name` field you provide to the plugin in your config is used to decorate the Fastify server. You can use that same value to access the config/functions exposed for each specific provider.

For example a config with a name field of "someProvider" will decorate `someProvider` on your fastify server instance:

```
fastify.someProvider
```

The typed value of this decorated property is `SmartAuthNamespace`. You can tell TypeScript about this like so:

```
declare module 'fastify' {
  interface FastifyInstance {
    someProvider: SmartAuthNamespace;
  }
}
```

### Functions

You can call the following functions on your decorated Fastify server (see above). See also the `SmartAuthNamespace`.

`authorizationCodeFlow`:

```
authorizationCodeFlow: AuthorizationCode
```

`getAccessTokenFromAuthorizationCodeFlow`:

```
getAccessTokenFromAuthorizationCodeFlow(
  request: FastifyRequest<SmartAuthRedirectQuerystring>,
): Promise<AccessToken>;
```

`getNewAccessTokenUsingRefreshToken`:

```
getNewAccessTokenUsingRefreshToken(
  refreshToken: string,
  params: Record<string, any>
): Promise<AccessToken>;
```

`generateAuthorizationUri`:

```
generateAuthorizationUri(
  scope?: SmartAuthScope[],
): string;
```

### Smart Health ID Provider Config

The supported configuration for the provider config is just a TypeScript interface:

```typescript
export interface SmartAuthProvider {
  /** A name to label the provider */
  name: string;
  /** Client registration */
  client: {
    id: string;
    secret: string;
  };
  /** Auth related config */
  auth: AuthCodeConfig | ClientCredentialsConfig;
}
```

SMART Auth profiles can be configured for both the Authorization Code grant flow (i.e. as in CARIN BlueButton 2.0's SMART support) and, separately, for the Client Credentials grant flow introduced in some SMART + FHIR systems even though it is not standard.

These are typed this way:

```typescript
interface SmartAuthConfig {
  /** Supported grant flow */
  grantFlow: GrantFlow;
  /** String used to set the host to request the tokens to. Required. */
  tokenHost: string;
  /** String path to request an access token. Default to /oauth/token. */
  tokenPath?: string;
  /** Optional params to post to the token exchange */
  tokenParams?: Record<string, any>;
}

interface ClientCredentialsConfig extends SmartAuthConfig {
  grantFlow: "client_credentials"
};

interface AuthCodeConfig extends SmartAuthConfig {
  grantFlow: "authorization_code"
  scope: SmartAuthScope[];
  /** An optional prefix to add to every route path */
  pathPrefix?: string;
  /** Optional params to append to the authorization redirect */
  authorizeParams?: Record<string, any>;
  /** String used to set the host to request an "authorization code". Default to the value set on auth.tokenHost. */
  authorizeHost?: string;
  /** String path to request an authorization code. Default to /oauth/authorize. */
  authorizePath?: string;
  /** String path to revoke an access token. Default to /oauth/revoke. */
  revokePath?: string;
  /** Where should users (with the auth code) be redirected to? */
  redirect: {
    /** A required host name for the auth code exchange redirect path. */
    host: string;
    /** An optional authorize path override. */
    path?: string;
  };
};
```

### Redirect/Callback 

By default, you need to define a redirect/callback path for your provider. This plugin is flexible about what you can do in this route.

There are TypeScript and Ajv schema helpers available for this route.

Your route must call `getAccessTokenFromAuthorizationCodeFlow` which exchanges the code/state in the last step of the authorization flow for you.

See the TypeScript example for an implementation.