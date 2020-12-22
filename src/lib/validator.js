import _ from 'lodash'
import validator from 'validator'

export default class Validator {
  constructor (schema) {
    this.schema = schema
  }

  async validate (data) {
    const errors = {}
    const keys = _.keys(this.schema)
    for (let i = 0; i < keys.length; i++) {
      const testResults = []
      if (_.isArray(this.schema[keys[i]])) {
        for (let t = 0; t < this.schema[keys[i]].length; t++) {
          const testResult = await this.test(this.schema[keys[i]][t].test, data[keys[i]], data)
          if (!testResult || (_.isObject(testResult) && testResult.result === false)) {
            testResults.push(_.isObject(testResult) && testResult.message ? testResult.message : this.schema[keys[i]][t].message)
          }
        }
      } else {
        const testResult = await this.test(this.schema[keys[i]].test, data[keys[i]], data)
        if (!testResult || (_.isObject(testResult) && testResult.result === false)) {
          testResults.push(_.isObject(testResult) && testResult.message ? testResult.message : this.schema[keys[i]].message)
        }
      }
      if (testResults.length) {
        errors[keys[i]] = testResults[0]
      }
    }
    return errors
  }

  async test (test, value, data) {
    if (_.isFunction(test)) {
      const result = await test(value, data)
      return result
    }

    if (_.isString(test)) {
      return validator[test](value)
    }
  }
}
