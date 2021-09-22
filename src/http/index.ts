/**
 * @module http
 */

import fastify, { FastifyInstance } from 'fastify'
import Config from '../config';

export default (config: Config) => {
  const http = fastify(config.http);

  return http;
}

export function start(http: FastifyInstance): void {
  http.listen(8080, '0.0.0.0', (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Sero booting at ${address}`)
  })
}