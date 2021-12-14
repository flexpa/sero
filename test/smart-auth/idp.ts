import { SmartAuthProvider } from "../../src";

export const AuthorizationCodeExample: SmartAuthProvider = {
  name: "idp",
  client: {
    id: "123",
    secret: "somesecret",
  },
  auth: {
    scope: ["launch"],
    grantFlow: "authorization_code",
    tokenHost: "http://external.localhost",
    authorizePath: "/smart/oauth/authorize",
    redirect: {
      host: "http://localhost:3000",
    },
  },
};

export const badNameExample: SmartAuthProvider = {
  name: "Bad Name",
  client: {
    id: "123",
    secret: "somesecret",
  },
  auth: {
    scope: ["launch"],
    grantFlow: "authorization_code",
    tokenHost: "http://external.localhost",
    authorizePath: "/smart/oauth/authorize",
    redirect: {
      host: "http://localhost:3000",
    },
  }
};

export const ClientCredentialsExample: SmartAuthProvider = {
  name: 'smart-stub',
  client: {
    id: 'foo',
    secret: 'bar',
  },
  auth: {
    grantFlow: "client_credentials",
    tokenHost: 'http://localhost/token'
  }
};