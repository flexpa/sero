import { http as app } from "../../test/fixtures/server"

test("create and read operations work", async () => {
  const response = await app.inject({
    method: 'GET',
    url: `/smart/auth`
  })

 expect(response.statusCode).toBe(302)
})