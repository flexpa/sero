import { Service, Card } from "@sero.run/sero";

const options = {
  id: "sero-patient-view",
  title: "Sero patient view",
  hook: "patient-view",
  description:
    "Patient view hook for the cds hooks track for the September 2021 HL7 connectathon",
};

const handler = async () => {
  return {
    cards: [
      new Card({
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Hi!`,
        detail: `Confirming this works`,
        indicator: "info",
      }),
    ],
  };
};

export default new Service(options, handler);
