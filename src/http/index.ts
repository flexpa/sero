import fastify, { FastifyInstance } from 'fastify'
import Config from '../config';
// import AjvErrors from "ajv-errors";

export default (config: Config): FastifyInstance => {

  const http = fastify(config.fastifyOpts);

  return http;
}

export function start(http: FastifyInstance): void {
	http.listen(8080, '0.0.0.0', (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address} - booted`)
  })
}