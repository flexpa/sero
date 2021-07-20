import ResourceType from "../../resources"

export as namespace SMART

export interface AccessTokenResponse {
  /**
   * token response
   */
  access_token: string

  /**
   * 	String value with a patient id, indicating that the app was launched in
   * 	the context of FHIR Patient 123. If the app has any patient-level scopes,
   * 	they will be scoped to Patient 123.
   */
  patient?: string

  /**
   * String value with an encounter id, indicating that the app was launched in
   * the context of FHIR Encounter 123.
   */
  encounter?: string

  /**
   * Boolean value indicating whether the app was launched in a UX context where
   * a patient banner is required (when true) or not required (when false). An
   * app receiving a value of false should not take up screen real estate
   * displaying a patient banner.
   */
  need_patient_banner?: boolean

  /**
   * String value describing the intent of the application launch
   */
  intent?: string

  /**
   * String URL where the host’s style parameters can be retrieved
   */
  smart_style_url?: string

  /**
   * String conveying an opaque identifier for the healthcare organization that
   * is invoking the app.
   */
  tenant?: string
}

export interface AppStyling {
  /**
   * The color used as the background of the app.
   */
  color_background?: string

  /**
   * The color used when UI elements need to indicate an area or item of concern
   * or dangerous action, such as a button to be used to delete an item, or a
   * display an error message.
   */
  color_error?: string

  /**
   * The color used when UI elements need to indicate an area or item of focus,
   * such as a button used to submit a form, or a loading indicator.
   */
  color_highlight?: string


  /**
   * The color used when displaying a backdrop behind a modal dialog or window.
   */
  color_modal_backdrop?: string

  /**
   * The color used when UI elements need to indicate a positive outcome, such
   * as a notice that an action was completed successfully
   */
  color_success?: string

  /**
   * The color used for body text in the app.
   */
  color_text?: string

  /**
   * The base corner radius used for UI element borders (0px results in square
   * corners).
   */
  dim_border_radius?: string

  /**
   * The base size of body text displayed in the app.
   */
  dim_font_size?: string

  /**
   * The base dimension used to space UI elements.
   */
  dim_spacing_size?: string

  /**
   * The list of typefaces to use for body text and elements.
   */
  font_family_body?: string

  /**
   * The list of typefaces to use for content heading text and elements.
   */
  font_family_heading?: string
}

export interface Launcher {
  /**
   * String conveying this system’s OpenID Connect Issuer URL. Required if the
   * server’s capabilities include sso-openid-connect; otherwise, omitted.
   */
  issuer?: string;
  /**
   * URL of the authorization server's authorization endpoint [RFC6749].  This
   * is REQUIRED unless no grant types are supported that use the authorization
   * endpoint.
   */
  authorization_endpoint: string;
  /**
   *  URL of the authorization server's token endpoint [RFC6749]. This is
   *  REQUIRED unless only the implicit grant type is supported.
   */
  token_endpoint: string;
  /**
   * URL of the authorization server's JWK Set [JWK] document.  The referenced
   * document contains the signing key(s) the client uses to validate signatures
   * from the authorization server. This URL MUST use the "https" scheme. The
   * JWK Set MAY also contain the server's encryption key or keys, which are
   * used by clients to encrypt requests to the server.  When both signing and
   * encryption keys are made available, a "use" (public key use) parameter
   * value is REQUIRED for all keys in the referenced JWK Set to indicate each
   * key's intended usage.
   */
  jwks_uri?: string
  /**
   * array of client authentication methods supported by the token endpoint. The
   * options are “client_secret_post” and “client_secret_basic”.
   */
  token_endpoint_auth_methods_supported?: ("client_secret_post" | "client_secret_basic" | "private_key_jwt" | "client_secret_jwt")[];
  /**
   * JSON array containing a list of the JWS signing algorithms ("alg" values)
   * supported by the token endpoint for the signature on the JWT [JWT] used to
   * authenticate the client at the token endpoint for the "private_key_jwt" and
   * "client_secret_jwt" authentication methods.  This metadata entry MUST be
   * present if either of these authentication methods are specified in the
   * "token_endpoint_auth_methods_supported" entry.  No default algorithms are
   * implied if this entry is omitted.  Servers SHOULD support "RS256".  The
   * value "none" MUST NOT be used.
   */
   token_endpoint_auth_signing_alg_values_supported?: ("RS256" | "ES384")[]
  /**
   * URL of the authorization server's OAuth 2.0 Dynamic Client Registration endpoint [RFC7591].
   */
  registration_endpoint?: string;
  /**
   * array of scopes a client may request. See scopes and launch context. The
   * server SHALL support all scopes listed here; additional scopes MAY be
   * supported (so clients should not consider this an exhaustive list).
   */
  scopes_supported: (ClinicalScopeV1 | ClinicalScopeV2 | ContextScope | RefreshTokenScope | IdentityScopes)[];
  /**
   * array of OAuth2 response_type values that are supported
   */
  response_types_supported: ("code" | "token")[];
  /**
   * URL where an end-user can view which applications currently have access to
   * data and can make adjustments to these access rights.
   */
  management_endpoint?: string;
  /**
   * URL to a server’s introspection endpoint that can be used to validate a
   * token
   */
  introspection_endpoint: string;
  /**
   * URL to a server’s revoke endpoint that can be used to revoke a token.
   */
  revocation_endpoint: string;
  /**
   * array of strings representing SMART capabilities (e.g., single-sign-on or
   * launch-standalone) that the server supports.
   */
  capabilities: (LaunchModeCapabilities | AuthorizationMethodCapabilities | ClientTypeCapabilities | SingleSignonCapabilities | LaunchContextCapabilities | PermissionCapabilities)[]
  /**
   * Array of PKCE code challenge methods supported. The S256 method SHALL be
   * included in this list, and the plain method SHALL NOT be included in this
   * list.
   */
  code_challenge_methods_supported: ["S256"]
}

type LaunchModeCapabilities = "launch-ehr" // support for SMART’s EHR Launch mode
  | "launch-standalone"; // support for SMART’s Standalone Launch mode

type AuthorizationMethodCapabilities = "authorize-post"; //  support for POST-based authorization

type ClientTypeCapabilities = "client-public" // support for SMART’s public client profile (no client authentication)
  | "client-confidential-symmetric" // support for SMART’s confidential client profile (symmetric client secret authentication)

type SingleSignonCapabilities = "sso-openid-connect" // support for SMART’s OpenID Connect profile

type LaunchContextCapabilities = "context-banner" // support for “need patient banner” launch context (conveyed via need_patient_banner token parameter)
  | "context-style" // support for “SMART style URL” launch context (conveyed via smart_style_url token parameter). This capability is deemed experimental.
  | "context-ehr-patient" // support for patient-level launch context (requested by launch/patient scope, conveyed via patient token parameter)
  | "context-ehr-encounter" // support for encounter-level launch context (requested by launch/encounter scope, conveyed via encounter token parameter)
  | "context-standalone-patient" // support for patient-level launch context (requested by launch/patient scope, conveyed via patient token parameter)
  | "context-standalone-encounter" // support for encounter-level launch context (requested by launch/encounter scope, conveyed via encounter token parameter)

type PermissionCapabilities = "permission-offline" // support for refresh tokens (requested by offline_access scope)
  | "permission-patient" // support for patient-level scopes (e.g. patient/Observation.rs)
  | "permission-user" // support for user-level scopes (e.g. user/Appointment.rs)
  | "permission-v1" // support for SMARTv1 scope syntax (e.g., patient/Observation.read)
  | "permission-v2" // support for SMARTv2 granular scope syntax (e.g., patient/Observation.rs?category=http://terminology.hl7.org/CodeSystem/observation-category|vital-signs)

type ContextScope = `launch${"" | "/"}${"" | "patient" | "user"}`

type RefreshTokenScope = "offline_access" | "online_access"

type IdentityScopes = "openid fhirUser" | "openid profile"

type ClinicalScopeV1 = `${"patient" | "user" | "system" }/${ResourceType | "*"}.${"read" | "write" | "*"}`

type ClinicalScopeV2 = `${"patient" | "user" | "system"}/${ResourceType | "*"}.${"c" | "r" | "u" | "d" | "s"}` // @todo params

export interface TokenIntrospectionResponse {
  active: boolean;
  scope: string;
  client_id: string;
  exp: number;
  patient?: string;
  intent?: string;
  iss?: string;
  sub?: string;
}