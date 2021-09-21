/**
 * @module @sero.run/sero
 */

export {
  mount as Rest
} from "./rest/index.js";

export {
  default as SmartAuth,
  SmartAuthCredentials,
  SmartAuthProvider,
  SmartAuthNamespace,
  SmartAuthRedirectQuerystringSchema,
  SmartAuthRedirectQuerystring
} from "./smart-auth/index.js";

// @todo rename these?
export {
  mount as CDSHooks,
  HookRequest,
  HookResponse,
  Card,
  Service,
  Suggestion,
  NoDecisionResponse,
} from "./cds-hooks/index.js";

export {
  default as Config
} from "./config";

export {
  default as Http,
  start
} from "./http/index.js";

export { default as Client } from "./client/index.js"