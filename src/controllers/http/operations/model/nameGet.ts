import { BaseModelHTTPOperation, BaseModelHTTPOperationParams } from './model'

export interface NameGet extends BaseModelHTTPOperation {
  kind: 'nameGet'
  params: {
    model: string
    method: 'name_get'
    args: Array<any>
    kwargs: any
  }
}

export interface CreateNameGetParams extends BaseModelHTTPOperationParams {
  modelName: string
  ids: Array<number>
}

export const createNameGetWithSessionToken = (sessionToken: string) => ({
  modelName,
  ids,
  /* istanbul ignore next */
  kwargs = {}
}: CreateNameGetParams): NameGet => {
  const nameGet: NameGet = {
    controllerType: 'http',
    kind: 'nameGet',
    serviceType: 'model',
    params: {
      args: [ids],
      kwargs: kwargs,
      method: 'name_get',
      model: modelName
    },
    path: '/web/dataset/call_kw',
    sessionToken
  }

  return nameGet
}
