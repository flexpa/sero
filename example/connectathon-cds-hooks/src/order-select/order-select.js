import { Service, Card, NoDecisionResponse } from "@sero.run/sero";

const options = {
  id: "sero-order-select",
  title: "Sero order select",
  hook: "order-select",
  description:
    "Order select hook for the cds hooks track for the September 2021 HL7 connectathon",
};

const handler = async (request) => {
  const context = request.context;
  // will only return cards if a medication order
  const order = context.draftOrders.entry?.find(
    (entry) => entry.resource.resourceType == "MedicationOrder"
  )?.resource;
  // if no order
  if (!order) throw new NoDecisionResponse();
  // now, we can make a comparison to some generic provider
  return {
    cards: [
      new Card({
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Hi!`,
        detail: `Medication order: ${JSON.stringify(order)}, and selection: ${
          context.selections[0]
        }`,
        indicator: "info",
      }),
    ],
  };
};

export default new Service(options, handler);
