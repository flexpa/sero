/**
 * @module client
 * @remarks Almost no-dependency TS FHIR client (we use cross fetch to give us a fetch instance)
 */

import fetch from "cross-fetch";

type Summary = "true" | "false" | "text" | "count" | "data";

export default function(baseUrl: string, init: RequestInit) {
  async function read(type: string, id: string, summary?: Summary) {
    return fetch(`${baseUrl}/${type}/${id}`, {
      method: "GET",
      ...init
    });
  }

  async function vread(type: string, id: string, vid: string) {
    return fetch(`${baseUrl}/${type}/${id}/_history/${vid}`, {
      method: "GET",
      ...init
    });
  }
  
  async function update(type: string, id: string, resource: fhir3.FhirResource | fhir4.FhirResource) {
    return fetch(`${baseUrl}/${type}/${id}`, {
      method: "PUT",
      body: JSON.stringify(resource),
      ...init
    });
  }

  async function patch(type: string, id: string, resource: fhir3.FhirResource | fhir4.FhirResource) {
    return fetch(`${baseUrl}/${type}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(resource),
      ...init
    });
  }

  async function destroy(type: string, id: string) {
    return fetch(`${baseUrl}/${type}/${id}`, {
      method: "DELETE",
      ...init
    });
  }

  /**
   * @todo not complete
   */
  async function search(type: string) {
    return fetch(`${baseUrl}/${type}`, {
      method: "GET",
      ...init
    });
  }

  async function create(type: string, id: string) {
    return fetch(`${baseUrl}/${type}`, {
      method: "POST",
      ...init
    });
  }

  async function history() {
    throw new Error("Not Implemented");
  }

  async function capabilities() {
    return fetch(`${baseUrl}/metadata`, {
      method: "GET",
      ...init
    });
  }

  async function batch(bundle: fhir3.Bundle | fhir4.Bundle) {
    return fetch(`${baseUrl}/`, {
      method: "POST",
      body: JSON.stringify(bundle),
      ...init
    });
  }

  async function transaction(bundle: fhir3.Bundle | fhir4.Bundle) {
    return fetch(`${baseUrl}/`, {
      method: "POST",
      body: JSON.stringify(bundle),
      ...init
    });
  }

  return {
    read,
    vread,
    update,
    patch,
    destroy,
    search,
    create,
    history,
    capabilities,
    batch,
    transaction
  }
}