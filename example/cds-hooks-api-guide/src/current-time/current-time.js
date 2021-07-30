import { Service, Card } from "@sero.run/sero";

const options = {
  id: "get-current-time",
  title: "A CDS service that responds with the current time",
  hook: "patient-view",
  description:
    "This example shows how easy it is to make a CDS hooks service with Sero. This service responds with the current time after being invoked by the patient-view hook",
};

const handler = async () => {
  const today = new Date();
  const minutes = today.getUTCMinutes();
  const time = `${today.getHours()}:${
    minutes <= 9 ? "0" : ""
  }${minutes}:${today.getSeconds()}`;
  return {
    cards: [
      new Card({
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `What time is it?`,
        detail: `The current time is ${time}`,
        indicator: "info",
      }),
    ],
  };
};

export default new Service(options, handler);
