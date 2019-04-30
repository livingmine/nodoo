import {
  BaseModelJSONRPCOperation,
  Merge,
  ObjectServiceArgs,
  ObjectMethodArgs,
  BaseModelJSONRPCOperationParams,
  Credentials
} from './model'

export interface NameSearch extends BaseModelJSONRPCOperation {
  kind: 'nameSearch'
  serviceArgs: Merge<
    ObjectServiceArgs,
    {
      methodArgs: Merge<
        ObjectMethodArgs,
        {
          modelMethod: 'name_search'
        }
      >
    }
  >
}

export interface CreateNameSearchParams extends BaseModelJSONRPCOperationParams {
  nameToSearch: string
  limit?: number
  operator?: string
  searchDomain?: Array<any>
}

export const createNameSearchWithCredentials = (credentials: Credentials) => ({
  modelName,
  nameToSearch,
  /* istanbul ignore next */
  limit = 100,
  /* istanbul ignore next */
  operator = 'ilike',
  /* istanbul ignore next */
  searchDomain = [],
  /* istanbul ignore next */
  kwargs = {}
}: CreateNameSearchParams): NameSearch => {
  const nameSearch: NameSearch = {
    credentials,
    controllerType: 'jsonrpc',
    serviceType: 'object',
    kind: 'nameSearch',
    path: '/jsonrpc',
    serviceArgs: {
      service: 'object',
      method: 'execute_kw',
      methodArgs: {
        ...credentials,
        model: modelName,
        modelMethod: 'name_search',
        modelMethodArgs: [nameToSearch, searchDomain, operator, limit],
        modelMethodKwargs: kwargs
      }
    }
  }

  return nameSearch
}
