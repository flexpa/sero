/**
 * @module rest
 */
import { FastifyInstance } from 'fastify'
import Config from '../config';
import * as routes from './routes/index.js';

export function mount(config: Config, http: FastifyInstance): void {
  routes.capabilityStatement(config, http);
  routes.interactions(config, http);
}