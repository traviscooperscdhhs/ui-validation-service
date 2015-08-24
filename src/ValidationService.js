'use-strict';
import _ from 'lodash';

/**
 * A list of properties to include with the rule config payload.
 * @type {string[]}
 * @private
 */
const fieldProperties = ['type', 'name', 'id', 'maxLength', 'required', 'min', 'max'];

export const VALIDATION_API_URL = '/emmis-portal/api/v1/rules';

/**
 * Handles calling validation API endpoint, and provides convenience methods
 * for formatting validation request payloads.
 * @class ValidationService
 */
class ValidationService {

  /**
   * Generate an object with name/value pair.
   * @param {object} field - a Field config
   * @returns {object}
   */
  static createFieldInput(field) {
    let value = field.value || '';
    return {[field.name]: value};
  }

  /**
   * Generate a list of rule configurations from a flat object
   * @param {object} field - a Field config
   * @returns {object[]}
   */
  static getRulesPayload(component) {
    return _.compact(_.map(component.rules, (enabled, ruleName) => {
      return !enabled ? null : {
        ruleName,
        config: _.pick(component, fieldProperties)
      };
    }));
  }

  /**
   * Parse verification request response
   * @param {object} response Ajax request response
   * @return {object} Resp with 'status' and 'message' used for verification tasks.
   */
  static parseVerificationResponse(response) {
    let status = 'waiting';
    let message = '';
    if (response.operationStatus === 'SUCCESS') {
      status = 'success';
    } else {
      let operationMessages = _.isEmpty(response.operationMessages) ? [{level: 'ERROR', description: ''}] : response.operationMessages;
      let respObj = operationMessages[0];
      status = respObj.level === 'ERROR' ? 'failure' : 'warning';
      message = respObj.description;
    }
    return {status, message};
  }

  constructor(url = VALIDATION_API_URL) {
    this.url = url;
  }

  /**
   * Calls validation API and returns a Promise so the calling code can take
   * action with the response.
   * @param {object} input - user input to validate, single key/value pair
   * @param {object} sessionData - user input, multiple key/value pairs
   * @param {object[]} rules - a list of rule to run
   * @returns {Promise}
   */
  validate(input = {}, sessionData = {}, rules = []) {
    let requestPayload = {input, sessionData, rules};
    let request = $.ajax({
      url: this.url,
      type: 'POST',
      data: JSON.stringify(requestPayload),
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8'
    });

    return request;
  }
}

export default ValidationService;
