import Client from ".";
import { fastify as app } from "../../test/fixtures/authServer"

test('Calling Capabilities returns a 200', async () => {
  // @todo this test should use a mock, not the live
  const { capabilities } = Client("https://r4.smarthealthit.org")

  const statement = await capabilities()
  const body = await statement.json();

  expect(statement.status).toEqual(200)
  expect(body.resourceType).toEqual("CapabilityStatement")
  app.close();
});

test('Calling Patient query returns some', async () => {
  // @todo this test should use a mock, not the live
  const { search, read } = Client("https://r4.smarthealthit.org")

  const searchQuery = search("Patient");
  const searchResponse = await searchQuery.next()

  let resourceType = searchResponse.value?.resourceType
  expect(resourceType).toEqual("Bundle")

  const patientQuery = await read({ type: "Patient", id: "87a339d0-8cae-418e-89c7-8651e6aab3c6" });

  // @todo should these aactually return the status etc or just the body
  // const patientResponse = await patientQuery.json() as fhir4.Patient

  // expect(patientQuery.status).toEqual(200)
  expect(patientQuery.resourceType).toEqual("Patient")
  app.close();
});

test('search returns pagination', async () => {
  // @todo this test should use a mock, not the live
  const { search } = Client("https://r4.smarthealthit.org")

  const searchQuery = search("Patient");
  await searchQuery.next();
  await searchQuery.next();
  await searchQuery.next();

  const testCall = await searchQuery.next();
  
  expect(testCall.done).toEqual(false);
  app.close();
});