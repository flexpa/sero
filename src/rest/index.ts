/**
 * @module sero/rest
 */
import { FastifyInstance } from 'fastify'
import Config from '../config';
import * as routes from './routes';

export default (config: Config, http: FastifyInstance): void => {
  config.rest?.forEach((module) => {
    routes[module](config, http);
  })
}