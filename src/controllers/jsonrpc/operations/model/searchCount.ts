import {
  BaseModelJSONRPCOperation,
  Merge,
  ObjectServiceArgs,
  BaseModelJSONRPCOperationParams,
  ObjectMethodArgs,
  Credentials
} from './model'

export interface SearchCount extends BaseModelJSONRPCOperation {
  kind: 'searchCount'
  serviceArgs: Merge<
    ObjectServiceArgs,
    {
      methodArgs: Merge<
        ObjectMethodArgs,
        {
          modelMethod: 'search_count'
        }
      >
    }
  >
}

export interface CreateSearchCountParams extends BaseModelJSONRPCOperationParams {
  searchDomain: Array<any>
}

export const createSearchCountWithCredentials = (credentials: Credentials) => ({
  modelName,
  searchDomain,
  /* istanbul ignore next */
  kwargs = {}
}: CreateSearchCountParams): SearchCount => {
  const searchCount: SearchCount = {
    credentials,
    controllerType: 'jsonrpc',
    serviceType: 'object',
    kind: 'searchCount',
    path: '/jsonrpc',
    serviceArgs: {
      service: 'object',
      method: 'execute_kw',
      methodArgs: {
        ...credentials,
        model: modelName,
        modelMethod: 'search_count',
        modelMethodArgs: [searchDomain],
        modelMethodKwargs: kwargs
      }
    }
  }

  return searchCount
}
