/**
 * Capabiltiies helpers and state
 */
import Resources from "../resources.js"
import { RestPluginConfig } from "./index.js";

export type RestResourceCapability = Partial<fhir4.CapabilityStatementRestResource>

export const defaultRestReourceCapability: RestResourceCapability = {
  conditionalCreate: false, // @todo
  conditionalDelete: 'not-supported', // @todo
  conditionalRead: 'not-supported', // @todo
  conditionalUpdate: false, // @todo
  interaction: [
    { code: 'create' },
    // { code: 'delete' }, @todo
    // { code: 'history-instance' }, @todo
    // { code: 'history-type' }, @todo
    // { code: 'patch' }, @todo
    { code: 'read' },
    // { code: 'search-type' }, @todo
    // { code: 'update' }, @todo
    // { code: 'vread' } @todo
  ],
  readHistory: false,
  // @todo top level config or documentation/feature?
  // referencePolicy: "literal",
  // @todo are things like $validate defined here?
  // operation?: CapabilityStatementRestResourceOperation[];
  // @todo
  // searchInclude?: string[];
  // @todo
  // searchParam?: CapabilityStatementRestResourceSearchParam[];
  // @todo
  // searchRevInclude?: string[]; // @todo
  updateCreate: false,
  versioning: 'no-version' // @todo
}

const version = process.env.version;
const name = "Sero Server Conformance Statement";
const date = (new Date()).toString();

export function CapabilityStatement(config: RestPluginConfig): fhir4.CapabilityStatement {

  const restResources: fhir4.CapabilityStatementRestResource[] = Object.values(Resources).map((resource) => {
    const hasOverride = config.restResourceCapabilities && Object.prototype.hasOwnProperty.call(config.restResourceCapabilities, resource as string);

    if (hasOverride && config.restResourceCapabilities) {
      return {
        type: resource as string,
        profile: `http://hl7.org/fhir/StructureDefinition/${resource}`,
        ...config?.restResourceCapabilities[resource as string]
      }
    } else {
      return {
        type: resource as string,
        profile: `http://hl7.org/fhir/StructureDefinition/${resource}`,
        ...defaultRestReourceCapability
      }
    }
  })

  const restInteractions: fhir4.CapabilityStatementRestInteraction[] = [
    { code: 'transaction' },
    { code: 'batch' },
    // { code: 'history-system' }, @todo
    // { code: 'search-system'} @todo
  ];

  const restOperations: fhir4.CapabilityStatementRestResourceOperation[] = [];

  return {
    resourceType: "CapabilityStatement",
    status: "draft",
    experimental: true,
    publisher: "Automate Medical Inc.",
    kind: "instance",
    name,
    date,
    software: {
      name: "Sero",
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
    patchFormat: [
      "application/fhir+json"
    ],
    rest: [{
      extension: [],
      interaction: restInteractions,
      mode: "server",
      operation: restOperations,
      resource: restResources
    }],
    copyright: "Copyright Automate Medical Inc. Licensed under the terms of the [Apache Software License 2.0](https://www.apache.org/licenses/LICENSE-2.0)."
  }
}

export function TerminologyCapabilities(_config: RestPluginConfig): fhir4.TerminologyCapabilities {
  return {
    resourceType: "TerminologyCapabilities",
    date: (new Date()).toString(),
    kind: "capability",
    status: "draft",
    version,
    name,
    codeSystem: []
  }
}