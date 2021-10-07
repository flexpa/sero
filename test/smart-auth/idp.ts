import { SmartAuthProvider } from "../../src";

const smartAuthProviderExample: SmartAuthProvider = {
  name: "idp",
  scope: ["launch"],
  redirectHost: "http://localhost:3000/smart/provider/redirect",
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