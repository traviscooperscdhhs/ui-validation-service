'use-strict';
import _ from 'lodash';

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
  static createFieldRulesPayload(field) {
    return _.compact(_.map(field.rules, (enabled, ruleName) => {
      return !enabled ? null : {
        ruleName,
        config: _.pick(field, ['type', 'name', 'id', 'maxLength', 'required'])
      };
    }));
  }

  /**
   * Build simple BSR payload
   * @param {array} rules BSR rules array
   * @return {object}
   */
  static getRulesPayload(rules) {
    return _.map(rules, (rule) => {
      return {ruleName: rule};
    });
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
