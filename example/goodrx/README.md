# GoodRx Prices as a Decision Support API

Pricing data about drugs matters to doctors.

This Sero example demonstrates using `sero/cds-hooks` to provide pricing data to a doctor about a drug when they are prescribing it in their EHR.

CDS Hooks is an open standard `sero/cds-hooks` implements support for. Importantly, we define a function that receives a request for decision support during the `order-select` workflow (ordering a drug for example) that makes a request to GoodRx's Compare Price API. The decision support API returns back to the doctor structured price information as a "card" or notification.