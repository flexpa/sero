import { randomUUID } from "crypto";
import { SystemAction } from "./util";

export default class Suggestion implements Suggestion {
  /**
   * Unique identifier of the card. MAY be used for auditing and logging cards
   * and SHALL be included in any subsequent calls to the CDS service's feedback
   * endpoint.
   */
  uuid: string;
  /**
   * Human-readable label to display for this suggestion (e.g. the CDS Client
   * might render this as the text on a button tied to this suggestion).
   */
  label: string;
  /**
   * When there are multiple suggestions, allows a service to indicate that a
   * specific suggestion is recommended from all the available suggestions on
   * the card. CDS Hooks clients may choose to influence their UI based on this
   * value, such as pre-selecting, or highlighting recommended suggestions.
   * Multiple suggestions MAY be recommended, if card.selectionBehavior is any.
   */
  isRecommended?: boolean;
  /**
   * Array of objects, each defining a suggested action. Within a suggestion,
   * all actions are logically AND'd together, such that a user selecting a
   * suggestion selects all of the actions within it.
   */
  actions?: SystemAction[];

  constructor(options: Partial<Suggestion> & { label: string }) {
    this.uuid = options.uuid || randomUUID();
    this.label = options.label;
    this.isRecommended = options.isRecommended;
    this.actions = options.actions;
  }
}

export interface AcceptedSuggestion {
  /**
   * The card.suggestion.uuid from the CDS Hooks response. Uniquely identifies
   * the suggestion that was accepted.
   */
  id: string
}