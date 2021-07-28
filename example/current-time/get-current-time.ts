import { Service, Card } from "../../src/cds-hooks";
import { Hooks } from "../../src/cds-hooks/util";

const options = {
  id: "get-current-time",
  title: "A CDS service that responds with the current time",
  hook: "patient-view" as Hooks,
  description:
    "This example shows how easy it is to make a CDS hooks service with Sero. This service responds with the current time after being invoked by the patient-view hook",
};

const handler = async () => {
  // only logic here - get the time
  const today = new Date();
  const minutes = today.getUTCMinutes();
  const time = `${today.getHours()}:${
    minutes <= 9 ? "0" : ""
  }${minutes}:${today.getSeconds()}`;
  // return a card with the time
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
