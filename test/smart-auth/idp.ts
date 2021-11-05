import { SmartAuthProvider } from "../../src";

export const smartAuthProviderExample: SmartAuthProvider = {
  name: "idp",
  scope: ["launch"],
  client: {
    id: "123",
    secret: "somesecret",
  },
  auth: {
    tokenHost: "http://external.localhost",
    authorizePath: "/smart/oauth/authorize",
  },
  redirect: {
    host: "http://localhost:3000",
  },
  iss: "http://external.localhost/issuer",
};

export const badNameProviderExample: SmartAuthProvider = {
  name: "Bad Name",
  scope: ["launch"],
  client: {
    id: "123",
    secret: "somesecret",
  },
  auth: {
    tokenHost: "http://external.localhost",
    authorizePath: "/smart/oauth/authorize",
  },
  redirect: {
    host: "http://localhost:3000",
  },
  iss: "http://external.localhost/issuer",
};