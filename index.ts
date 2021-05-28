import fastify from 'fastify'
import FHIR from '@automate-medical/fhir-schema-types'

const server = fastify()

server.get('/metadata', async (request, reply) => {
  const response: FHIR.CapabilityStatement = {
    resourceType: "CapabilityStatement"
  }

  reply.send(response)
})

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})