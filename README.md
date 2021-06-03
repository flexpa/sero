# fhir.ts

fhir.ts is an unnamed FHIR implementation targeting all three major definitions with Rust and TypeScript:

- [ ] FHIR Document support through persistence, typing, and validation tools
- [ ] FHIR REST API support through configurable server
  - [ ] HTTP client and server
  - [ ] GraphQL
- [ ] FHIR Messaging support

It currently has no published build.

## Progress

- Support for /metadata and the Conformance/CapabilityStatement retrieval is working
- Mocked functions for the instance level, type level, and system level REST APIs

## Contributing

```
npm install
npm run watch
npm run dev
```

## License

Copyright Automate Medical Inc.
