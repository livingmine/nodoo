import { BaseModelHTTPOperation, BaseModelHTTPOperationParams } from './model'

export interface NameSearch extends BaseModelHTTPOperation {
  kind: 'nameSearch'
  params: {
    model: string
    method: 'name_search'
    args: Array<any>
    kwargs: any
  }
}

export interface CreateNameSearchParams extends BaseModelHTTPOperationParams {
  nameToSearch: string
  limit?: number
  operator?: string
  searchDomain?: Array<any>
}

export const createNameSearchWithSessionToken = (sessionToken: string) => ({
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
    controllerType: 'http',
    kind: 'nameSearch',
    serviceType: 'model',
    params: {
      args: [nameToSearch, searchDomain, operator, limit],
      kwargs: kwargs,
      method: 'name_search',
      model: modelName
    },
    path: '/web/dataset/call_kw',
    sessionToken
  }

  return nameSearch
}
