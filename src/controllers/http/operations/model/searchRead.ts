import { BaseModelHTTPOperation, BaseModelHTTPOperationParams } from './model'

export interface SearchRead
  extends Pick<BaseModelHTTPOperation, Exclude<keyof BaseModelHTTPOperation, 'path'>> {
  kind: 'searchRead'
  params: {
    model: string
    domain: Array<any>
    fields?: Array<string>
    offset?: number
    limit: number | boolean
    sort?: string
    context?: any
  }
  path: '/web/dataset/search_read'
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface CreateSearchReadParams extends BaseModelHTTPOperationParams {
  domain: Array<any>
  fields?: Array<string>
  limit?: number | boolean
  offset?: number
  sort?: string
  context?: any
}

export const createSearchReadWithSessionToken = (sessionToken: string) => ({
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
  context = {}
}: Omit<CreateSearchReadParams, 'kwargs'>): SearchRead => {
  const searchRead: SearchRead = {
    controllerType: 'http',
    kind: 'searchRead',
    serviceType: 'model',
    params: {
      model: modelName,
      fields,
      offset,
      limit,
      domain,
      sort,
      context
    },
    path: '/web/dataset/search_read',
    sessionToken
  }

  return searchRead
}
