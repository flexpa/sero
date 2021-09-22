import { SmartAuthProvider } from "../../src";

const smartAuthProviderExample: SmartAuthProvider = {
  name: "idp",
  scope: ["launch"],
  credentials: {
    client: {
      id: "123",
      secret: "somesecret"
    },
    auth: {
      tokenHost: "http://external.localhost/smart/idp/token"
    }
  }
}

export default smartAuthProviderExample;