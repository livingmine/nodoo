import { BaseModelHTTPOperation, BaseModelHTTPOperationParams } from './model'

export interface Search extends BaseModelHTTPOperation {
  kind: 'search'

  params: {
    model: string
    method: 'search'
    args: Array<any>
    kwargs: any
  }
}

export interface CreateSearchParams extends BaseModelHTTPOperationParams {
  domain: Array<any>
  offset?: number
  limit?: number | boolean
  order?: string
  count?: boolean
}

export const createSearchWithSessionToken = (sessionToken: string) => ({
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
  /* istanbul ignore next */
  const search: Search = {
    controllerType: 'http',
    kind: 'search',
    serviceType: 'model',
    params: {
      args: [domain, offset, limit, order, count],
      kwargs: kwargs,
      method: 'search',
      model: modelName
    },
    sessionToken,
    path: '/web/dataset/call_kw'
  }

  /* istanbul ignore next */
  return search
}
