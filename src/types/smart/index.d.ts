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
   * Boolean value indicating whether the app was launched in a UX context
   * where a patient banner is required (when true) or not required (when
   * false). An app receiving a value of false should not take up screen real
   * estate displaying a patient banner.
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
}

export interface AppStyling {
  /**
   * The color used as the background of the app.
   */
  color_background?: string

  /**
   * The color used when UI elements need to indicate an area or item of
   * concern or dangerous action, such as a button to be used to delete an
   * item, or a display an error message.
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
   * The base corner radius used for UI element borders (0px results in square corners).
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
