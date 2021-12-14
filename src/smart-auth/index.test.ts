import { fastify as app } from "../../test/fixtures/authServer"
import { ClientCredentialsExample } from "../../test/smart-auth/idp"

import {
  getAccessTokenFromClientCredentialFlow,
} from './index';

import { ClientCredentials } from "simple-oauth2";

jest.mock("simple-oauth2", () => {
  const original = jest.requireActual('simple-oauth2');
  return {
    ...original,
    ClientCredentials: jest.fn().mockImplementation(() => ({
      getToken: () => new Promise(resolve => resolve('faketoken')),
    })),
  };
});

jest.mock('crypto', () => ({
  randomBytes: (_number: number) => "smart-auth-static-bytes-not-random-mock"
}));

describe("an authorize url", () => {
  test("short path helper is built from the ID of the SmartProviderAuth", async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/smart/idp/auth`
    })
  
    expect(response.statusCode).toBe(302)
  })
  
  test("correctly redirects to the configured tokenHost", async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/smart/idp/auth`
    })
  
    expect(response.headers['location']).toBe("http://external.localhost/smart/oauth/authorize?response_type=code&client_id=123&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsmart%2Fidp%2Fredirect&scope=launch&state=smart-auth-static-bytes-not-random-mock")
  })

  test("accepts scope overrides but falls back to defaults", async () => {
    const overrideResponse = await app.inject({
      method: 'GET',
      url: `/smart/idp/auth`,
      query: {
        scope: ["launch", "patient/Observation.read"]
      }
    })

    expect(overrideResponse.headers['location']).toBe("http://external.localhost/smart/oauth/authorize?response_type=code&client_id=123&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsmart%2Fidp%2Fredirect&scope=launch%20patient%2FObservation.read&state=smart-auth-static-bytes-not-random-mock")
  
    const defaultResponse = await app.inject({
      method: 'GET',
      url: `/smart/idp/auth`
    })

    expect(defaultResponse.headers['location']).toBe("http://external.localhost/smart/oauth/authorize?response_type=code&client_id=123&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsmart%2Fidp%2Fredirect&scope=launch&state=smart-auth-static-bytes-not-random-mock")
  })
})

describe("a provider with a weird name", () => {
  test("still has nice pretty URLs", async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/smart/bad-name/auth`
    })
  
    expect(response.statusCode).toBe(302)
    expect(response.headers['location']).toBe("http://external.localhost/smart/oauth/authorize?response_type=code&client_id=123&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsmart%2Fbad-name%2Fredirect&scope=launch&state=smart-auth-static-bytes-not-random-mock")
  })
})

describe("getAccessTokenFromClientCredentialFlow", () => {
  it("returns an access token", async () => {
    const token = await getAccessTokenFromClientCredentialFlow(ClientCredentialsExample);
    expect(ClientCredentials).toHaveBeenCalled();
    expect(token).toEqual('faketoken');
  });
});
  
// @todo this requires implementing a mocked oauth server response
test.todo("a callback url (in the server fixture) is successfully callable") 
//, async () => {
//   const response = await app.inject({
//     method: 'GET',
//     url: `/smart/idp/redirect`
//   })

//   expect(response.statusCode).toBe(200)
// })