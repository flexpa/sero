import { SmartAuthProvider } from "../../src";

const smartAuthProviderExample: SmartAuthProvider = {
  name: "idp",
  scope: ["launch"],
  client: {
    id: "123",
    secret: "somesecret"
  },
  auth: {},
  redirect: {
    host: "http://localhost:3000"
  },
  iss: "http://external.localhost/test"
}

export default smartAuthProviderExample;