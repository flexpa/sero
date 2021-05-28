import FHIR from "@automate-medical/fhir-schema-types"

export default (): FHIR.CapabilityStatement => {
  return {
    resourceType: "CapabilityStatement"
  }
}

