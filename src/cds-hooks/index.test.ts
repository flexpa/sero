import { randomUUID } from "crypto";
import { http as app } from "../../example/cds-hooks"

test('Discovery service call returns 200', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/cds-services'
  })
  expect(response.statusCode).toEqual(200)
});

test('Discovery service call returns JSON', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/cds-services'
  })
  expect(response.headers["content-type"]).toEqual("application/json; charset=utf-8")
});

test('Discovery service call returns a list of services', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/cds-services'
  })

  const body = JSON.parse(response.body);

  expect(body).toEqual({"services":[{"hook":"appointment-book","description":"An example","prefetch":{"patient":"Patient/{{context.patientId}}"},"title":"appointment-book Hook Service Example","id":"1"},{"hook":"medication-prescribe","description":"An example","prefetch":{"patient":"Patient/{{context.patientId}}"},"title":"medication-prescribe Hook Service Example","id":"4"},{"hook":"encounter-discharge","description":"An example","prefetch":{"patient":"Patient/{{context.patientId}}"},"title":"encounter-discharge Hook Service Example","id":"2"},{"hook":"encounter-start","description":"An example","prefetch":{"patient":"Patient/{{context.patientId}}"},"title":"encounter-start Hook Service Example","id":"3"},{"hook":"order-review","description":"An example","prefetch":{"patient":"Patient/{{context.patientId}}"},"title":"order-review Hook Service Example","id":"5"},{"hook":"order-select","description":"An example","prefetch":{"patient":"Patient/{{context.patientId}}"},"title":"order-select Hook Service Example","id":"6"},{"hook":"order-sign","description":"An example","prefetch":{"patient":"Patient/{{context.patientId}}"},"title":"order-sign Hook Service Example","id":"7"},{"hook":"patient-view","description":"An example","prefetch":{"patient":"Patient/{{context.patientId}}"},"title":"patient-view Hook Service Example","id":"8"}]});
})

test('A HookRequest without a required context parameter should fail', async () => {
  // This maps up to patient-view
  const response = await app.inject({
    method: 'POST',
    url: '/cds-services/8',
    payload: {
      hook: "patient-view",
      hookInstance: randomUUID(),
      context: {
        userId: "Practitioner/123",
      }
    }
  });

  const body = JSON.parse(response.body);

  expect(response.statusCode).toEqual(400)
  // @todo requires fixing the error messages
  expect(body).toEqual({"statusCode":400,"error":"Bad Request","message":"body.context should have required property 'patientId'"})
})

test('A HookRequest without a required prefetch parameter should fail', async () => {
  // This maps up to patient-view
  const response = await app.inject({
    method: 'POST',
    url: '/cds-services/8',
    payload: {
      hook: "patient-view",
      hookInstance: randomUUID(),
      context: {
        userId: "Practitioner/123",
        patientId: "Patient/123"
      }
    }
  });

  const body = JSON.parse(response.body);

  expect(response.statusCode).toEqual(400)
  expect(body).toEqual({"statusCode":400,"error":"Bad Request","message":"body.prefetch should have required property 'patient'"})
})