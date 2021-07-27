# GoodRx Prices as a Decision Support API

## Overview

Transparency on drug pricing changes the [decisions](https://pubmed.ncbi.nlm.nih.gov/11025790/) [doctors](https://pubmed.ncbi.nlm.nih.gov/29255097/) [make](https://pubmed.ncbi.nlm.nih.gov/29321043/). Good data on what prescriptions cost _while they are prescribing them_ is both something (1) doctors say they want and (2) doctors who have the data have been shown to have reduced per-patient perscription costs than those who do not. Meanwhile, open standards have emerged ([CDS Hooks](https://cds-hooks.hl7.org/)) as a way of getting decision support to doctors directly inside of the EHR (i.e. patient specific recommendations on drug pricing).

In this example. we introduce the use of third party consumer pricing data ([GoodRx](https://www.goodrx.com/)) over a decision support API provided by the Sero toolkit to deliver drug price to doctors while they are making the prescription. Sero can be used to make decision support APIs and SMART on FHIR apps.

https://www.loom.com/share/05034bda49e240daa2ee353505a0d3cc

## Walkthrough

CDS Hooks is an open decision support API that `@sero.run/sero` implements support for. As part of HL7, and closely related to FHIR, CDS Hooks is the only open standard for 3rd party developers ____. [Spec, Internal, Reference conformance]

This code walkthrough will focus primarily on [good-rx-compare-price.ts](./src/good-rx-compare-price.ts), the actual decision support service. We'll make use of helper functions we've written to work with the GoodRx API, but the vast majority of the example is contained in [good-rx-compare-price.ts]().

### Imports

We start by importing the `Service` and `Card` classes. We'll use these to create our decision support service and to describe our responses to inbound requests. We also import an helper class, `NoDecisionResponse`, used to reply with a standard "no comment" response. We're also importing `HookRequest` and `Hooks` - which are TypeScript declarations. Lastly, we import our helper method for the GoodRx API.

```typescript
import { Service, Card, HookRequest, NoDecisionResponse } from "@sero.run/sero";
import { Hooks } from "@sero.run/sero/cds-hooks/util"
import { comparePrice } from "./api.js";
```

### Options

Every decision support service provided by a server in the CDS Hooks model identifies itself as part of a response to `/cds-services`. We definen options object that we will use in the construction of `Service`. Importantly, we declare that the `Service` expects to respond to the `order-select` hook request.

```typescript
const options = {
  id: "good-rx-comparison",
  title: "GoodRx Compare Price Service for MedicationRequest",
  hook: "order-select" as Hooks,
  description: "GoodRx's Compare Price API is used to provide drug cost estimates during the prescription order workflow",
};
```

### Handler 
The most critical part of our decision support API is the function that we run when we get a request for decision support from our consumers like EHRs. We define an async function called `handler`:

```typescript
const handler = async (request) => {
  ...
}
```

Every decision support request includes a context attribute that we validate the presence of in Sero. When the handler function executes, a developer can have confidence that a `draftOrders` key will exist on `request.context` _and_ that it will be shaped like a FHIR Bundle (we're using the `@types/fhir` to annotate that here).

```typescript
const { draftOrders }: { draftOrders: fhir4.Bundle } = request.context;
```

The `order-select` hook *requires* that a Bundle of FHIR Resources be provided at `draftOrders`, but those resources could be `NutritionOrder`, `ServiceRequest`, or `VisionPrescription` in addition to the one we care about: `MedicationRequest`. We filter the `draftOrders` for `MedicationRequest` resources.

```typescript
const medicationRequest = draftOrders.entry
  ?.find((e) => e.resource?.resourceType == "MedicationRequest")
  ?.resource as fhir4.MedicationRequest
```

If no `MedicationRequest` was found, we throw a `NoDecisionResponse` because we can only provide decision support when one is present. This thrown error is handled by Sero automatically, sending back response the CDS Hooks specification expects:

```typescript
  if (!medicationRequest) throw new NoDecisionResponse();
```

Otherwise, we *do* have a MedicationRequest, so let's use the text associated with the request (i.e. the "name" of the drug) to make a price comparison request to the GoodRx Compare Price API (here we have abstracted the API requirements into a small utility library). The utility uses `async/await` but we can also make use of `Promise`:

```typescript
  const response = await comparePrice(medicationRequest);
```

With the response from GoodRx, our handler function can now return relavent pricing data related to the `MedicationRequest`. We create an return a `Card` containing a summary of the low/high price, the brand name, generic names, the cheapest pharmacy, and an associated coupon.

```typescript
  return {
    cards: [
      new Card({
        source: {
          label: "GoodRx"
        },
        summary: `${response.display} ($${Math.min(...response.prices)} - $${Math.max(...response.prices)})`,
        indicator: "info",
        detail: `
          * Brand: ${response.brand.join(", ")}
          * Generic: ${response.generic.join(", ")}
          * Cheapest pharmacy: ${response.price_detail.pharmacy[0]} (${response.price_detail.savings[0]} savings)
          * Coupon: ${response.price_detail.url[0]}
        `,
      })
    ]
  }
```

### Creating the service

Finally, we construct the `Service`:

```typescript
export default new Service(options, handler);
```

The boilerplate in [index.ts](./src/index.ts) takes this module and boots a fully functional, end-to-end conformant CDS Hooks 1.1 API using the `Service` we defined in this example.

## Running it locally

We've provided a `Dockerfile` to build and run the project in isolation. Note that in order to actually successfully make requests to the Good RX Compare Price API you must set two environment variables `GOOD_RX_API_KEY` and `GOOD_RX_SECRET_KEY` which only GoodRx can issue.

```bash
docker build -t goodrx-cds:latest .
docker run -p 8080:8080 -ti --rm goodrx-cds:latest
```

Confirm the service is running and responding:

```bash
curl http://localhost:8080/cds-services
```