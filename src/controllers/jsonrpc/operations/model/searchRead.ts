import {
  BaseModelJSONRPCOperation,
  Merge,
  ObjectServiceArgs,
  BaseModelJSONRPCOperationParams,
  ObjectMethodArgs,
  Credentials
} from './model'

export interface SearchRead extends BaseModelJSONRPCOperation {
  kind: 'searchRead'
  serviceArgs: Merge<
    ObjectServiceArgs,
    {
      methodArgs: Merge<
        ObjectMethodArgs,
        {
          modelMethod: 'search_read_pagination'
        }
      >
    }
  >
}

export interface CreateSearchReadParams extends BaseModelJSONRPCOperationParams {
  domain: Array<any>
  fields?: Array<string>
  limit?: number | boolean
  offset?: number
  sort?: string
  context?: any
}

export const createSearchReadWithCredentials = (credentials: Credentials) => ({
  modelName,
  domain,
  /* istanbul ignore next */
  fields = [],
  /* istanbul ignore next */
  limit = false,
  /* istanbul ignore next */
  offset = 0,
  /* istanbul ignore next */
  sort = '',
  /* istanbul ignore next */
  kwargs = {}
}: CreateSearchReadParams): SearchRead => {
  const searchRead: SearchRead = {
    credentials,
    controllerType: 'jsonrpc',
    serviceType: 'object',
    kind: 'searchRead',
    path: '/jsonrpc',
    serviceArgs: {
      service: 'object',
      method: 'execute_kw',
      methodArgs: {
        ...credentials,
        model: modelName,
        // This method is coming from a custom Odoo module as the original search_read method from Odoo
        // is not sufficient for pagination, i.e., it does not return the length of the matched records
        // if offset and limit parameters are given.
        modelMethod: 'search_read_pagination',
        modelMethodArgs: [fields, offset, limit, domain, sort],
        modelMethodKwargs: kwargs
      }
    }
  }

  return searchRead
}
