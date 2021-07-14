import { Service, Card } from "../../src/cds-hooks";
import { comparePrice } from "./api";

export default new Service(
  {
    id: "good-rx-comparison",
    title: "GoodRx Compare Price Service for MedicationRequest",
    hook: "order-select",
    description: "An example"
  },
  async (request: CDSHooks.HookRequest<any>) => {
    const { draftOrders }: { draftOrders: fhir4.Bundle<fhir4.MedicationRequest> } = request.context;

    if (!draftOrders) 

    const response = await comparePrice({ name: "lipitor" });

    // need some way of defining a 412

    return {
      cards: [
        new Card({
          detail: "This is a card",
          source: {
            label: "CDS Services Inc",
          },
          summary: "A summary of the findings",
          indicator: "info"
        })
      ]
    }
  }
)