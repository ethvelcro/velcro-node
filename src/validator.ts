import Ajv from 'ajv'
import fs from 'fs'
const _schema = require('./webhook.schema.json')

let _validator

// async function loadSchema() {
//   if (!_schema) {
//     _schema = fs.readFileSync()
//   }
//   return _schema
// }

export function validator() {
  if (!_validator) {
    var ajv = new Ajv();
    _validator = ajv.compile(_schema)
  }
  return _validator
}
