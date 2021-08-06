/**
 * @module client
 * @beta
 *
 * A Fetch-ful FHIR Client in TypeScript
 *
 * @example Grab a capabilities statement:
 * ```typescript
 *  const { capabilities } = Client("https://r4.smarthealthit.org");
 *  await capabilities().json() as fhir4.CapabilityStatement;
 * ```
 *
 * @example Easily read a Patient resource:
 * ```typescript
 *  const { read } = Client("https://r4.smarthealthit.org")
 *  await read("Patient", "87a339d0-8cae-418e-89c7-8651e6aab3c6").json() as fhir4.Patient;
 * ```
 * 
 * @example Iterables returned for the searchType operation:
 * ```typescript
 *  const { searchType } = Client("https://r4.smarthealthit.org")
 *  const search = searchType("Patient");
 *  search.next(); 
 * ```
 * 
 * @todo update client to use FhirResource string type union when it is available in @types/fhir
 */

import fetch, { Headers } from "cross-fetch";
import { URLSearchParams } from "url";

type Summary = "true" | "false" | "text" | "count" | "data";


export default function(baseUrl: string, init: RequestInit = {}): {
  read: { (query: string | { type: string; id: string; }, summary?: Summary): Promise<fhir4.FhirResource> };
  vread: { (type: string, id: string, vid: string): Promise<Response> };
  update: { (type: string, id: string, resource: fhir4.FhirResource): Promise<Response> };
  patch: { (type: string, id: string, resource: fhir4.FhirResource ): Promise<Response> };
  destroy: { (type: string, id: string): Promise<Response> };
  searchType: { (type: string, query?: Record<string, any>): AsyncGenerator<fhir4.Bundle, undefined> };
  create: { (type: string): Promise<Response> };
  historyType: any;
  historyInstance: any;
  capabilities: { (): Promise<Response> }
  batch: { (bundle: fhir4.Bundle): Promise<Response> }
  transaction: { (bundle: fhir4.Bundle): Promise<Response> }
} {
  const headers = new Headers({
    "User-Agent": "sero.run"
  });

  let options = {
    headers,
    ...init
  }

  /**
   * Read the current state of the resource
   */
  async function read(query: string | { type: string; id: string; }, _summary?: Summary) {
    let uri: string;

    if (typeof query === "string") {
      uri = `${baseUrl}/${query}`
    } else {
      uri = `${baseUrl}/${query.type}/${query.id}`;
    }

    const response = await fetch(uri, {
      method: "GET",
      ...options
    });

    if (!response.ok) throw new Error(await response.text());

    return await response.json() as fhir4.FhirResource;
  }


  /**
   * Read the state of a specific version of the resource
   */
  async function vread(type: string, id: string, vid: string) {
    return fetch(`${baseUrl}/${type}/${id}/_history/${vid}`, {
      method: "GET",
      ...options
    });
  }

  /**
   * Update an existing resource by its id (or create it if it is new)
   */
  async function update(type: string, id: string, resource: fhir4.FhirResource) {
    return fetch(`${baseUrl}/${type}/${id}`, {
      method: "PUT",
      body: JSON.stringify(resource),
      ...options
    });
  }

  /**
   * Update an existing resource by posting a set of changes to it
   */
  async function patch(type: string, id: string, resource: fhir4.FhirResource) {
    return fetch(`${baseUrl}/${type}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(resource),
      ...options
    });
  }

  /**
   * Delete a resource
   */
  async function destroy(type: string, id: string) {
    return fetch(`${baseUrl}/${type}/${id}`, {
      method: "DELETE",
      ...options
    });
  }

  /**
   * Search the resource type based on some filter criteria OR Search across all resource types based on some filter criteria
   * @note query here doesn't do any active type checking, although it may be able to
   * @todo has a max call stack bug for large page counts
   */
   async function* searchType(type: string, query?: Record<string, any>) {
    const params = new URLSearchParams(query);
    const uri = `${baseUrl}/${type}${params ? "?".concat(params.toString()) : null}`;
    return yield * paginated(uri, options);
  }

  /**
   * Create a new resource with a server assigned id
   */
  async function create(type: string) {
    return fetch(`${baseUrl}/${type}`, {
      method: "POST",
      ...options
    });
  }

  /**
   * Retrieve the change history for a particular resource instance
   */
  async function historyInstance() {
    throw new Error("Not Implemented");
  }

  /**
   * Retrieve the change history for a particular resource type
   */
  async function historyType() {
    throw new Error("Not Implemented");
  }

  /**
   * Get a capability statement for the system
   */
  async function capabilities() {
    return fetch(`${baseUrl}/metadata`, {
      method: "GET",
      ...options
    });
  }

  /**
   * Update, create or delete a set of resources in a single interaction
   */
  async function batch(bundle: fhir4.Bundle) {
    return fetch(`${baseUrl}/`, {
      method: "POST",
      body: JSON.stringify(bundle),
      ...options
    });
  }

  /**
   * Update, create or delete a set of resources in a single interaction
   */
  async function transaction(bundle: fhir4.Bundle) {
    return fetch(`${baseUrl}/`, {
      method: "POST",
      body: JSON.stringify(bundle),
      ...options
    });
  }

  return {
    read,
    vread,
    update,
    patch,
    destroy,
    searchType,
    create,
    historyInstance,
    historyType,
    capabilities,
    batch,
    transaction
  }
}

async function* paginated(endpoint: string, init: RequestInit = {}): AsyncGenerator<fhir4.Bundle, undefined> {
  const response = await fetch(endpoint, init);

  if (!response.ok) throw new Error(await response.text());

  const page = await response.json() as fhir4.Bundle;

  yield page; 

  const nextLink = page.link?.find((link) => link.relation === 'next');

  if (nextLink?.url) {
    yield * paginated(nextLink.url);
  }

  return;
}