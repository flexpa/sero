import { FastifyReply, FastifyRequest } from "fastify";
import FHIR from "@automate-medical/fhir-schema-types"

export async function read(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}
export async function vread(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}
export async function update(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}
export async function patch(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}
export async function destroy(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}
export async function history(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}
export async function search(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}
export async function create(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}
export async function batch(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}

const version = "0.0.0"
const name = "Timber Server Conformance Statement"

const CapabilityStatement: FHIR.CapabilityStatement =  {
  resourceType: "CapabilityStatement",
  status: "draft",
  publisher: "Automate Medical Inc.",
  kind: "instance",
  name,
  software: {
    name: "fhir.ts",
    version
  },
  implementation: {
    description: "FHIR Server"
  },
  fhirVersion: "4.0.1",
  version,
  format: [
    "application/fhir+json"
  ],
  rest: []
}

const TerminologyCapabilities: FHIR.TerminologyCapabilities = {
  resourceType: "TerminologyCapabilities",
  status: "draft",
  version,
  name,
  codeSystem: []
}

export async function capabilities(request: FastifyRequest, reply: FastifyReply) {
  // @ts-expect-error
  switch (request.query.mode) {

    case "normative":
      // the entirety of the capability statement is normative today
      reply.send(CapabilityStatement)
      break;

    case "terminology":
      reply.send(TerminologyCapabilities)
      break;

    default:
      // default is to send the full statement
      reply.send(CapabilityStatement)
      break;
  }
}