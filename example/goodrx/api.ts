import fetch from "cross-fetch";

export default async function goodRxRequest(path: string, options: Record<string, any>) {
  if (!process.env.GOOD_RX_API_KEY) throw new Error("process.env.GOOD_RX_API_KEY must be set")
  
  const params = queryParams({
    api_key: process.env.GOOD_RX_API_KEY,
    ...options
  })

  const response = await fetch(`https://api.goodrx.com${path}?${sign(params)}`)

  const { data, errors }: { data: ComparePriceJSONResponse, errors: any } = await response.json()
  if (response.ok) {
    return data
  } else {
    return Promise.reject(errors)
  }
}

function queryParams(options: ComparePriceOptions & { api_key: string }) {
  return new URLSearchParams(options as Record<string,any>).toString()
}

function sign(params: string) {
  return params;
}

interface ComparePriceOptions {
  name?: string;
  ndc?: string; // NDC must be in the 11 character format stripped of dashes
  form?: string; // tablet
  dosage?: number; // 2, 2.5, 14.0
  quantity?: number; // 30
  manufacturer?: "brand" | "generic" | "match";
}

export function comparePrice(query: ComparePriceOptions) {
  return goodRxRequest("/compare-price", query);
}

interface ComparePriceJSONResponse {
  brand: string[];
  generic: string[];
  display: string;
  form: string;
  dosage: string;
  quantity: number;
  prices: number[];
  price_detail: {
    url: (number | null)[];
    price: number[];
    savings: (string | null)[];
    type: string[];
    pharmacy: string[];
  }
  url: string;
  manufacturer: string;
}