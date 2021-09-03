## smart-auth

The default export of this module is a Fastify plugin. You can use it to register the SMART Auth (OAuth 2.0) routes for a Smart Health ID provider (i.e. a CARIN BB 1.0 implementation).

You can use it like so:

```typescript
import {
  Http,
  SmartAuth,
  SmartAuthRedirectQuerystring as Querystring,
  SmartAuthRedirectQuerystringSchema as QuerystringSchema
} from "@sero.run/sero"

const http = Http();

http.register(SmartAuth, {
  name: "example-provider",
  scope: ["patient/*.read"],
  credentials: {
    id: "0546a83e-e7ad-4de2-9584-44fbfe7da959",
    secret: "a91ffa44-f9e9-4d4d-a822-f3d4a42b9f95"
  }
})

http.get<Querystring>("/smart/example-provider/redirect", QuerystringSchema, async (request, reply) => {
  const response = await http["example-provider"].getAccessTokenFromAuthorizationCodeFlow(request)

  reply("Sucessfully connected")
})

// Start the server
start(http);
```