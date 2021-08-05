import { Client } from "@sero.run/sero"
import chalk from "chalk";
import { Humana } from "./glossary.js"
const { log } = console;

/**
 * Step 1: Insurance plan network query - skip this if you already know the network
 * 
 * Start by initializing the client and destructuring the operations we will use
 */
const { searchType, read } = Client("https://fhir.humana.com/api")
// Then, search for Humana's Insurance Plans
const planSearch = await searchType("InsurancePlan").next()
// Next, find the first Insurance Plan in the response
const insurancePlan = planSearch.value?.entry?.find((bundleEntry) => {
  return bundleEntry.resource?.resourceType == "InsurancePlan"
})?.resource as fhir4.InsurancePlan
// Destructure name, plan, and network from the plan Resource
const { name, plan, network } = insurancePlan;
// Destructure value into planId from the first Medical Network available
const { value: planId } = network?.find(n => {
  return n.identifier?.system == Humana.MedicalDentalNetwork
})?.identifier as fhir4.Identifier

/**
 * Step 2: Find an in-network Hematology specialist role
 * 
 * Make the query parameters for searchType
 */
const hematologyQuery = {
  "specialty:text": "Hematology",
  _tag: `${Humana.MedicalDentalNetwork}|${planId}`,
  active: true
}
// Search for PractitionerRole's that advertise Hematology in the specialty text
const specialistSearch = await searchType("PractitionerRole", hematologyQuery).next()
// Find the first PractitionerRole with a matching individual Practitioner
const specialistRole = specialistSearch.value?.entry?.find((bundleEntry) => {
  return bundleEntry.resource?.resourceType == "PractitionerRole" && bundleEntry.resource.practitioner
})?.resource as fhir4.PractitionerRole

/**
 * Step 3: Find specific information about the matched specialist
 * 
 * Find the actual specialist/practitioner with the PractitionerRole
 */
const { practitioner } = specialistRole;
// Guard against the possibility of the pracitioner not existing
if (!practitioner?.reference) throw new Error("No practitioner matched that search")
// Read the Practitioner from the API
let readPractitioner = await read(practitioner.reference) as fhir4.Practitioner

/**
 * Step 4: Log the results of the search
 */
log(`
${chalk.bgBlueBright.bold(" Plan Name ")} ${chalk.blueBright.bold(name)}
${chalk.bgBlueBright.bold(" Network Type ")} ${chalk.blueBright.bold(Humana.MedicalDentalNetwork)}
${chalk.bgBlueBright.bold(" Network ID ")} ${chalk.blueBright.bold(planId)}

${chalk.bgRedBright.bold(" Provider Directory Query ")} ${chalk.red.bold(JSON.stringify(hematologyQuery, null, 2))}

${chalk.bgGreen.bold(" Practitioner Found ")} ${chalk.greenBright.bold(practitioner?.reference)}
${chalk.bgGreen.bold(" Practitioner Specialties ")} ${chalk.greenBright.bold([...new Set(specialistRole.specialty?.map(s => s.text))])}
${chalk.bgGreen.bold(" Practitioner NPI ")} ${chalk.greenBright.bold(`https://npino.com/npi/${readPractitioner?.identifier?.map(i => i.value)[0]}`)}
`);