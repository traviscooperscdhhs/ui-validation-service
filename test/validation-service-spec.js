'use-strict';
import _ from 'lodash';
import ValidationService, {VALIDATION_API_URL} from '../src/ValidationService';
import fixture from './fixtures/validation';

describe('ValidationService', () => {

  beforeEach(() => {
    jasmine.Ajax.install();
  });

  afterEach(() => {
    jasmine.Ajax.uninstall();
  });

  it('can call validation endpoint', (done) => {
    let $validation = new ValidationService();
    let input = ValidationService.createFieldInput(fixture.field);
    let rules = ValidationService.createFieldRulesPayload(fixture.field);

    jasmine.Ajax
      .stubRequest(VALIDATION_API_URL)
      .andReturn(fixture.fieldResponse);

    $validation
      .validate(input, {}, rules)
      .then((response) => {
        let req = jasmine.Ajax.requests.mostRecent();
        let params = req.data();
        // inspect the request data
        expect(params.rules.length).toEqual(2);
        expect(params.input[fixture.field.name]).toEqual(fixture.field.value);
        // inspect response
        expect(response.operationStatus).toEqual('SUCCESS');
        done();
      });
  });

  describe('#createFieldInput', () => {
    it('can create a key/value structure for field name/value', () => {
      let input = ValidationService.createFieldInput(fixture.field);
      expect(input[fixture.field.name]).toBeDefined();
      expect(input[fixture.field.name]).toBe(fixture.field.value);
    });
  });

  describe('#createFieldRulesPayload', () => {
    it('can create a list of rules from passed in rules config', () => {
      let rules = ValidationService.createFieldRulesPayload(fixture.field);
      expect(rules.length).toBe(2);
      expect(_.has(fixture.field.rules, rules[0].ruleName)).toBe(true);
    });
  });
});
