import {
  BaseModelJSONRPCOperation,
  Merge,
  ObjectServiceArgs,
  BaseModelJSONRPCOperationParams,
  ObjectMethodArgs,
  Credentials
} from './model'

export interface Search extends BaseModelJSONRPCOperation {
  kind: 'search'
  serviceArgs: Merge<
    ObjectServiceArgs,
    {
      methodArgs: Merge<
        ObjectMethodArgs,
        {
          modelMethod: 'search'
        }
      >
    }
  >
}

export interface CreateSearchParams extends BaseModelJSONRPCOperationParams {
  domain: Array<any>
  offset?: number
  limit?: number | boolean
  order?: string
  count?: boolean
}

export const createSearchWithCredentials = (credentials: Credentials) => ({
  /* istanbul ignore next */
  modelName,
  /* istanbul ignore next */
  domain,
  /* istanbul ignore next */
  offset = 0,
  /* istanbul ignore next */
  limit = false,
  /* istanbul ignore next */
  order,
  /* istanbul ignore next */
  count = false,
  /* istanbul ignore next */
  kwargs = {}
}: CreateSearchParams): Search => {
  const search: Search = {
    credentials,
    controllerType: 'jsonrpc',
    serviceType: 'object',
    kind: 'search',
    path: '/jsonrpc',
    serviceArgs: {
      service: 'object',
      method: 'execute_kw',
      methodArgs: {
        ...credentials,
        model: modelName,
        modelMethod: 'search',
        modelMethodArgs: [domain, offset, limit, order, count],
        modelMethodKwargs: kwargs
      }
    }
  }

  return search
}
