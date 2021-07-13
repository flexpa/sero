import { randomUUID } from "crypto";
import Suggestion from "./suggestion";

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
export default class Card implements CDSHooks.Card {
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
  source: CDSHooks.Source;
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
  overrideReasons?: CDSHooks.OverrideReason[];
  /**
   * Allows a service to suggest a link to an app that the user might want to
   * run for additional information or to help guide a decision.
   */
  links?: CDSHooks.Link[];

  constructor(options: Partial<CDSHooks.Card> & { source: CDSHooks.Source; summary: string; indicator: 'info' } ) {
    this.uuid = options.uuid || randomUUID();
    this.detail = options.detail;
    this.suggestions = options.suggestions as Suggestion[];
    this.selectionBehavior = options.selectionBehavior;
    this.overrideReasons = options.overrideReasons;
    this.links = options.links;
    this.source = options.source;
    this.summary = options.summary;
    this.indicator = options.indicator;
  }
}