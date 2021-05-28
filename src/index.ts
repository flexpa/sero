import fastify from 'fastify'
import metadata from './metadata'

const server = fastify()

server.get('/metadata', async (request, reply) => {
  reply.send(metadata)
})

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})