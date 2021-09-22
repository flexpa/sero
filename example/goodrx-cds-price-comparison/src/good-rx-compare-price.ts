/* eslint-disable indent */
import { Service, Card, HookRequest, NoDecisionResponse } from "@sero.run/sero";
import { Hooks } from "@sero.run/sero/cds-hooks/util";
import { comparePrice } from "./api.js";

const options = {
  id: "good-rx-comparison", // Used to define the HTTP routes for the Service
  title: "GoodRx Compare Price Service for MedicationRequest", // A narrative title used to generate UI config for Services by places like the LogicaSandbox
  hook: "order-select" as Hooks, // Identifies the "hook" context this service should be executed in (the hook determines what information will be sent)
  description:
    "GoodRx's Compare Price API is used to provide drug cost estimates during the prescription order workflow",
};

const handler = async (request: HookRequest<any>) => {
  /**
   * draftOrders is a required context submission for the order-select hook
   *
   * Every decision support request includes a context attribute that we
   * validate the presence of in Sero - so when this function executes, a
   * developer can have confidence that a draftOrders key will exist on
   * request.context and it will be shaped like a FHIR Bundle.
   */
  const { draftOrders }: { draftOrders: fhir4.Bundle } = request.context;
  /**
   * The order-select hook *requires* that a Bundle of resources be provided
   * at draftOrders, but now that a MedicationRequest actually exists here. We
   * could be making a DeviceRequest for example. So next order of operations
   * is to identify which, if any, of the item bundle contents are a
   * Medication Request
   */
  const medicationRequest = draftOrders.entry?.find(
    (e) => e.resource?.resourceType == "MedicationRequest"
  )?.resource as fhir4.MedicationRequest; // All FHIR Resources have a resourceType field // https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions

  /**
   * If no MedicationRequest was found, throw a NoDecisionResponse - which is
   * handled by Sero automatically and returns an empty Card set
   */
  if (!medicationRequest) throw new NoDecisionResponse();

  /**
   * Otherwise, we have a MedicationRequest, so let's use the text associated
   * with the request (i.e. the "name" of the drug) to make a price comparison
   * request to the GoodRx API (here we have abstracted the API requirements
   * into a small utility library)
   */
  const response = await comparePrice(medicationRequest);

  /**
   * Create and return a Card that contains pricing information about the drug
   * from the GoodRx response. This example looks like:
   *
   * ```
   * {
   *   source: { label: "GoodRx" },
   *   summary: "Glucophage (metformin) - ($2.18 - $3.33)"
   *   indicator: "info",
   *   detail: "* Brand: glucophage
   *   * Generic: metformin
   *   * Cheapest pharmacy: CVS Pharmacy (37% savings)
   *   * Coupon: https://www.goodrx.com/coupon/apex?drug_id=4703&pharmacy_id=115179&quantity=60"
   * }
   * ```
   *
   * This would render a Card in the EHR with a link to the coupon actually
   * needed for the Patient to redeem the price.
   *
   */
  return {
    cards: [
      new Card({
        source: {
          label: "GoodRx",
        },
        summary: `${response.display} ($${Math.min(
          ...response.prices
        )} - $${Math.max(...response.prices)})`,
        indicator: "info",
        detail: `
          * Brand: ${response.brand.join(", ")}
          * Generic: ${response.generic.join(", ")}
          * Cheapest pharmacy: ${response.price_detail.pharmacy[0]} (${
          response.price_detail.savings[0]
        } savings)
          * Coupon: ${response.price_detail.url[0]}
        `,
      }),
    ],
  };
};

/**
 * A Service provides clinical decision support through a structured
 * interface/API envisioned to run directly on the rails of existing EHR
 * systems.
 */
export default new Service(options, handler);
