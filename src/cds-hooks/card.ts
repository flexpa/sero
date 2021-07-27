import { randomUUID } from "crypto";
import Suggestion, { AcceptedSuggestion } from "./suggestion.js";

/**
 * A **Card** contains decision support from a CDS Service.
 *
 * Generally speaking, cards are intended for display to an end user. The data
 * format of a card defines a very minimal set of required attributes with
 * several more optional attributes to suit a variety of use cases. For
 * instance, narrative informational decision support, actionable suggestions to
 * modify data, and links to SMART apps.
 *
 * One or many {@link Suggestion} can be created with each card.
 *
 * @version https://cds-hooks.hl7.org/ballots/2020Sep/
 *
 * @example Here's an example of creating a Card without any suggestions:
 * ```typescript
 * new Card({
 *   summary: "High risk for opioid overdose - taper now",
 *   detail: "Total morphine milligram equivalent (MME) is 125mg. Taper to less than 50.",
 *   source: {
 *     label: "CDC Guidelines",
 *     url: "https://guidelines.gov/summaries/summary/50153/cdc-guideline-for-prescribing-opioids-for-chronic-pain---united-states-2016#420"
 *   },
 *   links: [{
 *     label: "MME Conversion Tables",
 *     type: "absolute",
 *     url: "https://www.cdc.gov/drugoverdose/pdf/calculating_total_daily_dose-a.pdf"
 *   }]
 * })
 * ```
 */
export default class Card {
  /**
   * Unique identifier of the card. MAY be used for auditing and logging cards
   * and SHALL be included in any subsequent calls to the CDS service's feedback
   * endpoint.
   */
  uuid: string;
  /**
   * One-sentence, less than 140-character summary message for display to the user
   * inside of this card.
   */
  summary: string;
  /**
   * Optional detailed information to display; if provided MUST be represented
   * in (GitHub Flavored) Markdown. (For non-urgent cards, the CDS Client MAY
   * hide these details until the user clicks a link like "view more
   * details...").
   */
  detail?: string;
  /**
   * Urgency/importance of what this card conveys. Allowed values, in order of
   * increasing urgency, are: info, warning, critical. The CDS Client MAY use
   * this field to help make UI display decisions such as sort order or
   * coloring.
   */
  indicator: 'info' | 'warning' | 'critical';
  /**
   * Grouping structure for the Source of the information displayed on this
   * card. The source should be the primary source of guidance for the decision
   * support the card represents.
   */
  source: Source;
  /**
   * Allows a service to suggest a set of changes in the context of the current
   * activity (e.g. changing the dose of the medication currently being
   * prescribed, for the `medication-prescribe` activity). If suggestions are
   * present, `selectionBehavior` MUST also be provided.
   */
  suggestions?: Suggestion[];
  /**
   * Describes the intended selection behavior of the suggestions in the card.
   * Allowed values are: at-most-one, indicating that the user may choose none
   * or at most one of the suggestions;any, indicating that the end user may
   * choose any number of suggestions including none of them and all of them.
   * CDS Clients that do not understand the value MUST treat the card as an
   * error.
   */
  selectionBehavior?: 'at-most-one' | 'any';
  /**
   * Override reasons can be selected by the end user when overriding a card
   * without taking the suggested recommendations. The CDS service MAY return a
   * list of override reasons to the CDS client. The CDS client SHOULD present
   * these reasons to the clinician when they dismiss a card. A CDS client MAY
   * augment the override reasons presented to the user with its own reasons.
   */
  overrideReasons?: OverrideReason[];
  /**
   * Allows a service to suggest a link to an app that the user might want to
   * run for additional information or to help guide a decision.
   */
  links?: Link[];

  constructor(options: Partial<Card> & { source: Source; summary: string; indicator: 'info' | 'warning' | 'critical' } ) {
    this.uuid = options.uuid || randomUUID();
    this.detail = options.detail;
    this.suggestions = options.suggestions;
    this.selectionBehavior = options.selectionBehavior;
    this.overrideReasons = options.overrideReasons;
    this.links = options.links;
    this.source = options.source;
    this.summary = options.summary;
    this.indicator = options.indicator;
  }
}

interface Coding {
  system?: string
  version?: string
  code?: string
  display?: string
  userSelected?: string
}

interface OverrideReason {
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

interface Link {
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

interface Source {
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