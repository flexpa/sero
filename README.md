# Sero

[![Build](https://github.com/Automate-Medical/sero/actions/workflows/build.yaml/badge.svg)](https://github.com/Automate-Medical/sero/actions/workflows/build.yaml)

Sero is a modular TypeScript toolchain for FHIR (and friends) sponsored by [Automate Medical Inc.](https://www.automatemedical.com/)

<img width="176" alt="Automate Medical Inc." src="https://user-images.githubusercontent.com/704789/123880097-31e0ac80-d8ff-11eb-996b-1b852b187e6a.png">

Health data is spreading everywhere. FHIR is a big part of that. Sero is built for developers who need tools in the languages they know, with opinionated answers to solve common problems.

Features:
- Multiple feature-specific composable modules 
- REST API implementation for [FHIR](https://www.hl7.org/fhir/http.html) with base R4 resources and unfinished operations
- A functional [CDS Hooks](#cds-hooks) Service implementation
- Alpha In-memory Store design for persisting FHIR as a log
- Out of box typings support for FHIR R4 with generics, CDS Hooks 

Roadmap:
- Resource specific routing engine
- GraphQL API implementation of base resources
- SMART Apps/Launching
- Access control
- Building a TS native Validator
- Executing CQL 
- Profile support
- Deployment configurations
- Subscriptions/Streams


## Docs
* [Quick Start](#quick-start)
* [REST](#rest)
* [CDS Hooks](#cds-hooks)
* [Development](#development)
* [License](#license)

### Quick Start

Install node 14.x on your platform.

The default example will boot at port 8080. You can see the full example at [example/full-server.ts](.example/full-server.ts)

```shell
git clone https://github.com/automate-medical/sero
npm install
npm start
```

### REST

Serotiny exposes a `Rest` service that adds routes for `batch`, `capabilityStatement`, `instanceOperations`, and `typeOperations` routes and handlers.

It consomes an instance of `http` and appends the configurable list above.

### CDS Hooks

Serotiny exposes `Service` and `Card` classes which can be used from the `@sero/cds-hooks` module.

"CDS Hooks" are a protocol separate from FHIR proper, but involve the use of its data structures.

Serotiny automatically scaffolds all of the necessary API routes in the spec when you create a new Service, and exposes a simple, typed function that executes on `hookRequest` events.

Building support for this protocol as a distribution/access channel for novel clinical decision making techniques is super easy with Serotiny. Because of its modular design, CDS Hooks can be run as a totally standalone service: `example/cds-hooks.ts` shows an instance of Serotiny in this configuration.

#### Conformance notes
- Implements Discovery service call
- Implements HookRequest call, and invoking a service
- Implements Feedback call
- Loading Services from `PlanDefinition` is not currently possible
- Currently passes Touchstone with a warning

#### Links
- https://www.hl7.org/fhir/clinicalreasoning-cds-on-fhir.html
- https://cds-hooks.org/

### Development

We currently target the Node 14.x runtime. You can use nodemon to watch + compile on file system events with `npm run watch` + `npm run dev`.

```
npm install
npm run watch
npm run dev
```

### License

Copyright 2021 Automate Medical Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Copyright Automate Medical Inc.
