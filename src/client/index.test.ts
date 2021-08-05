import Client from ".";

test('Calling Capabilities returns a 200', async () => {
  // @todo this test should use a mock, not the live
  const { capabilities } = Client("https://r4.smarthealthit.org")

  const statement = await capabilities()
  const body = await statement.json();

  expect(statement.status).toEqual(200)
  expect(body.resourceType).toEqual("CapabilityStatement")
});

test('Calling Patient query returns some', async () => {
  // @todo this test should use a mock, not the live
  const { searchType, read } = Client("https://r4.smarthealthit.org")

  const searchQuery = searchType("Patient");
  const searchResponse = await searchQuery.next()

  let resourceType = searchResponse.value?.resourceType
  expect(resourceType).toEqual("Bundle")

  const patientQuery = await read({ type: "Patient", id: "87a339d0-8cae-418e-89c7-8651e6aab3c6" });

  // @todo should these aactually return the status etc or just the body
  // const patientResponse = await patientQuery.json() as fhir4.Patient

  // expect(patientQuery.status).toEqual(200)
  expect(patientQuery.resourceType).toEqual("Patient")
});

test('searchType returns pagination', async () => {
  // @todo this test should use a mock, not the live
  const { searchType } = Client("https://r4.smarthealthit.org")

  const searchQuery = searchType("Patient");
  await searchQuery.next();
  await searchQuery.next();
  await searchQuery.next();

  const testCall = await searchQuery.next();
  
  expect(testCall.done).toEqual(false);
});