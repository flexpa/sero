import fetch from "cross-fetch";

export default function goodRxRequest(path: string, query: Record<string, any>): Promise<Response> {
  Object.keys(query)

  return fetch(`https://api.goodrx.com${path}?${sign(query)}`)
}

function sign(query: string) {
  // @todo
  return query;
}

interface ComparePriceOptions {
  name?: string;
  ndc?: string; // NDC must be in the 11 character format stripped of dashes
  form?: string; // tablet
  dosage?: number; // 2, 2.5, 14.0
  quantity?: number; // 30
  manufacturer?: "brand" | "generic" | "match";
}

export function comparePrice(query: ComparePriceOptions): Promise<Response> {
  return goodRxRequest("/compare-price", query);
}