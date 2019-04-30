import { BaseModelHTTPOperation, BaseModelHTTPOperationParams } from './model'

export interface SearchCount extends BaseModelHTTPOperation {
  kind: 'searchCount'

  params: {
    model: string
    method: 'search_count'
    args: Array<any>
    kwargs: any
  }
}

export interface CreateSearchCountParams extends BaseModelHTTPOperationParams {
  searchDomain: Array<any>
}

export const createSearchCountWithSessionToken = (sessionToken: string) => ({
  modelName,
  searchDomain,
  /* istanbul ignore next */
  kwargs = {}
}: CreateSearchCountParams): SearchCount => {
  const searchCount: SearchCount = {
    controllerType: 'http',
    kind: 'searchCount',
    serviceType: 'model',
    params: {
      args: [searchDomain],
      kwargs: kwargs,
      method: 'search_count',
      model: modelName
    },
    path: '/web/dataset/call_kw',
    sessionToken
  }

  return searchCount
}
