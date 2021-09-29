import { Rest } from "../../src"

import Http from "fastify";
import { RestPluginConfig } from "../../src/rest";

const pluginConfig: RestPluginConfig = {
  restResourceCapabilities: {}
}

export const http = Http();

http.register(Rest, pluginConfig)