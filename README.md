# SCDHHS UI Validation Service

## Installation
This module is intended for use in ES2015 modules, CommonJS modules, or nodejs.
```shell
$ npm install @scdhhs/ui-validation-service
```

### Dependencies
This module depends on **lodash** version 3.

## Usage
```javascript
import ValidationService from '@scdhhs/ui-validation-service';

let $validation = new ValidationService();
let inputData = {foo: 'bar'};
let sessionData = {baz: 'boo'};
let rules = [{ruleName: 'test'}];

$validation
  .validate(inputData, sessionData, rules)
  .then((response) => {
    // do something with the response from validation API
  });
```

By default, the service points to the following endpoint: `/emmis-portal/api/v1/rules`. Pass in a URL to the service constructor to point to a different endpoint:
```javascript
let $validation = new ValidationService('/my/validation/api');
```
