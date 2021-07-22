export as namespace CDSHooksSpec

export interface Coding {
    system?: string
    version?: string
    code?: string
    display?: string
    userSelected?: string
  }
  
export interface OverrideReason {
    /**
     * The Coding object representing the override reason selected by the end
     * user. Required if user selected an override reason from the list of
     * reasons provided in the Card (instead of only leaving a userComment).
     */
    reason?: Coding
  
    /**
     * The CDS Client may enable the clinician to further explain why the card
     * was rejected with free text. That user comment may be communicated to the
     * CDS Service as a userComment.
     */
    userComment?: string
  }
  
export interface AcceptedSuggestion {
    /**
     * The card.suggestion.uuid from the CDS Hooks response. Uniquely identifies
     * the suggestion that was accepted.
     */
    id: string
  }
  
export interface Feedback {
    /**
     * The card.uuid from the CDS Hooks response. Uniquely identifies the card.
     */
    card: string
  
    /**
     * A value of accepted or overridden.
     */
    outcome: 'accepted' | 'overridden'
  
    /**
     * An array of json objects identifying one or more of the user's
     * AcceptedSuggestions. Required for accepted outcomes.
     */
    acceptedSuggestions?: AcceptedSuggestion[]
  
    /**
     * A json object capturing the override reason as a Coding as well as any
     * comments entered by the user.
     */
    overrideReason?: OverrideReason
  
    /**
     * ISO timestamp in UTC when action was taken on card.
     */
    outcomeTimestamp: string
  }
  
export interface Link {
    /**
     * Human-readable label to display for this link (e.g. the CDS Client might
     * render this as the underlined text of a clickable link).
     */
    label: string
  
    /**
     * URL to load (via GET, in a browser context) when a user clicks on this
     * link. Note that this MAY be a "deep link" with context embedded in path
     * segments, query parameters, or a hash.
     */
    url: string
  
    /**
     * The type of the given URL. There are two possible values for this field. A
     * type of absolute indicates that the URL is absolute and should be treated
     * as-is. A type of smart indicates that the URL is a SMART app launch URL
     * and the CDS Client should ensure the SMART app launch URL is populated
     * with the appropriate SMART launch parameters.
     */
    type: 'absolute' | 'smart'
  
    /**
     * An optional field that allows the CDS Service to share information from
     * the CDS card with a subsequently launched SMART app. The appContext field
     * should only be valued if the link type is smart and is not valid for
     * absolute links. The appContext field and value will be sent to the SMART
     * app as part of the OAuth 2.0 access token response, alongside the other
     * SMART launch parameters when the SMART app is launched. Note that
     * appContext could be escaped JSON, base64 encoded XML, or even a simple
     * string, so long as the SMART app can recognize it.
     */
    appContext?: string
  }
  
export interface Suggestion {
    /**
     * Human-readable label to display for this suggestion (e.g. the CDS Client
     * might render this as the text on a button tied to this suggestion).
     */
    label: string
  
    /**
     * Unique identifier, used for auditing and logging suggestions.
     */
    uuid?: string
  
    /**
     * When there are multiple suggestions, allows a service to indicate that a
     * specific suggestion is recommended from all the available suggestions on
     * the card. CDS Hooks clients may choose to influence their UI based on this
     * value, such as pre-selecting, or highlighting recommended suggestions.
     * Multiple suggestions MAY be recommended, if card.selectionBehavior is any.
     */
    isRecommended?: boolean
  
    /**
     * Array of objects, each defining a suggested action. Within a suggestion,
     * all actions are logically AND'd together, such that a user selecting a
     * suggestion selects all of the actions within it.
     */
    actions?: SystemAction[]
  }
  
export interface Source {
    /**
     * A short, human-readable label to display for the source of the information
     * displayed on this card. If a url is also specified, this MAY be the text
     * for the hyperlink.
     */
    label: string
  
    /**
     * An optional absolute URL to load (via GET, in a browser context) when a
     * user clicks on this link to learn more about the organization or data set
     * that provided the information on this card. Note that this URL should not
     * be used to supply a context-specific "drill-down" view of the information
     * on this card. For that, use link.url instead.
     */
    url?: string
  
    /**
     * An absolute URL to an icon for the source of this card. The icon returned
     * by this URL SHOULD be a 100x100 pixel PNG image without any transparent
     * regions.
     */
    icon?: string
  
    /**
     * A topic describes the content of the card by providing a high-level
     * categorization that can be useful for filtering, searching or ordered
     * display of related cards in the CDS client's UI. This specification does
     * not prescribe a standard set of topics.
     */
    topic?: Coding
  }
  
export interface Card {
    /**
     * Unique identifier of the card. MAY be used for auditing and logging cards
     * and SHALL be included in any subsequent calls to the CDS service's
     * feedback endpoint.
     */
    uuid?: string
  
    /**
     * One-sentence, <140-character summary message for display to the user inside of this card.
     */
    summary: string
  
    /**
     * Optional detailed information to display; if provided MUST be represented
     * in (GitHub Flavored) Markdown. (For non-urgent cards, the CDS Client MAY
     * hide these details until the user clicks a link like "view more
     * details...").
     */
    detail?: string
  
    /**
     * Urgency/importance of what this card conveys. Allowed values, in order of
     * increasing urgency, are: info, warning, critical. The CDS Client MAY use
     * this field to help make UI display decisions such as sort order or
     * coloring.
     */
    indicator: 'info' | 'warning' | 'critical'
  
    /**
     * Grouping structure for the Source of the information displayed on this
     * card. The source should be the primary source of guidance for the decision
     * support the card represents.
     */
    source: Source
  
    /**
     * Allows a service to suggest a set of changes in the context of the current
     * activity (e.g. changing the dose of a medication currently being
     * prescribed, for the order-sign activity). If suggestions are present,
     * selectionBehavior MUST also be provided.
     */
    suggestions?: Suggestion[]
  
    /**
     * Describes the intended selection behavior of the suggestions in the card.
     * Allowed values are: at-most-one, indicating that the user may choose none
     * or at most one of the suggestions;any, indicating that the end user may
     * choose any number of suggestions including none of them and all of them.
     * CDS Clients that do not understand the value MUST treat the card as an
     * error.
     */
    selectionBehavior?: 'at-most-one' | 'any'
  
    /**
     * Coding	Override reasons can be selected by the end user when overriding a
     * card without taking the suggested recommendations. The CDS service MAY
     * return a list of override reasons to the CDS client. The CDS client SHOULD
     * present these reasons to the clinician when they dismiss a card. A CDS
     * client MAY augment the override reasons presented to the user with its own
     * reasons.
     */
    overrideReasons?: OverrideReason[]
  
    /**
     * Allows a service to suggest a link to an app that the user might want to
     * run for additional information or to help guide a decision.
     */
    links?: Link[]
  }
  
export interface SystemAction {
    /**
     * The type of action being performed. Allowed values are: create, update, delete.
     */
    type: 'create' | 'update' | 'delete'
  
    /**
     * Human-readable description of the suggested action MAY be presented to the
     * end-user.
     */
    description: string
  
    /**
     * A FHIR resource. When the type attribute is create, the resource attribute
     * SHALL contain a new FHIR resource to be created. For update, this holds
     * the updated resource in its entirety and not just the changed fields. Use
     * of this field to communicate a string of a FHIR id for delete suggestions
     * is DEPRECATED and resourceId SHOULD be used instead.
     */
    resource?: any
  
    /**
     * A relative reference to the relevant resource. SHOULD be provided when the
     * type attribute is delete.
     */
    resourceId?: string
  }
  
export interface HookResponse {
    /**
     * An array of Cards. Cards can provide a combination of information (for
     * reading), suggested actions (to be applied if a user selects them), and
     * links (to launch an app if the user selects them). The CDS Client decides
     * how to display cards, but this specification recommends displaying
     * suggestions using buttons, and links using underlined text.
     */
    cards?: Card[]
  
    /**
     * An array of actions that the CDS Service proposes to auto-apply. Each
     * action follows the schema of a card-based suggestion.action. The CDS
     * Client decides whether to auto-apply actions.
     */
    systemActions?: SystemAction[]
  }
  
// -- Request
  
export interface FhirAuthorization {
    /**
     * This is the OAuth 2.0 access token that provides access to the FHIR
     * server.
     */
    access_token: string
  
    token_type: 'Bearer'
  
    /**
     * The lifetime in seconds of the access token.
     */
    expires_in: number
  
    /**
     * The scopes the access token grants the CDS Service.
     */
    scope: string
  
    /**
     * The OAuth 2.0 client identifier of the CDS Service, as registered with the
     * CDS Client's authorization server.
     */
    subject: string
  }
  
export interface HookRequestWithFhir<T> extends HookRequestBasic<T> {
    /**
     * The base URL of the CDS Client's FHIR server. If fhirAuthorization is
     * provided, this field is REQUIRED. The scheme should be https
     */
    fhirServer: string
  
    /**
     * A structure holding an OAuth 2.0 bearer access token granting the CDS
     * Service access to FHIR resources, along with supplemental information
     * relating to the token.
     */
    fhirAuthorization: FhirAuthorization
  }
  
export interface HookRequestBasic<T> {
    /**
     * The hook that triggered this CDS Service call. See:
     * https://cds-hooks.org/specification/current/#hooks
     */
    hook: string
  
    /**
     * A universally unique identifier (UUID) for this particular hook call.
     */
    hookInstance: string
  
    /**
     * Hook-specific contextual data that the CDS service will need. For example,
     * with the patient-view hook this will include the FHIR identifier of the
     * Patient being viewed. For details, see the Hooks specification page.
     */
    context: any
  
    /**
     * The FHIR data that was prefetched by the CDS Client
     */
    prefetch: T
  }
  
  type HookRequest<T> = HookRequestBasic<T> | HookRequestWithFhir<T>
  
  
// -- Discovery
  
/**
   * A prefetch template is a FHIR read or search request that describes relevant
   * data needed by the CDS Service. See:
   * https://cds-hooks.org/specification/current/#prefetch-template
   */
export interface PrefetchTemplate {
    [key: string]: string
  }
  
export interface Service {
    /**
     * The hook this service should be invoked on
     */
    hook: string
  
    /**
     * The human-friendly name of this service.
     */
    title?: string
  
    /**
     * The description of this service.
     */
    description: string
  
    /**
     * The {id} portion of the URL to this service which is available at
     * `{baseUrl}/cds-services/{id}`
     */
    id: string
  
    /**
     * An object containing key/value pairs of FHIR queries that this service is
     * requesting that the CDS Client prefetch and provide on each service call.
     * The key is a string that describes the type of data being requested and
     * the value is a string representing the FHIR query.
     */
    prefetch?: PrefetchTemplate
  }
  
/**
   * The response to the discovery endpoint SHALL be an object containing a list
   * of CDS Services.
   */
export interface DiscoveryResponse {
    /**
     * An array of CDS Services.
     */
    services: Service[]
  }
  