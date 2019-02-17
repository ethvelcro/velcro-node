import { Webhook, QueryResult, QueryParamMapping } from "./types";
import { get } from 'lodash'

export function formatResult(webhook: Webhook, result: Object): QueryResult {
  let queryResult = result
  if (webhook.paramMapping && webhook.paramMapping.length) {
    queryResult = webhook.paramMapping.reduce((accumulator: any, param: QueryParamMapping) => {
      accumulator[param.paramName] = get(result, param.resultPath)
      return accumulator
    }, {})
  }
  return {
    webhook,
    result: queryResult
  }
}
