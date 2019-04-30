import { BaseModelHTTPOperation, BaseModelHTTPOperationParams } from './model'

export interface Delete extends BaseModelHTTPOperation {
  kind: 'delete'

  params: {
    model: string
    method: 'unlink'
    args: Array<any>
    kwargs: any
  }
}

export interface CreateDeleteParams extends BaseModelHTTPOperationParams {
  ids: Array<number>
}

export const createDeleteWithSessionToken = (sessionToken: string) => ({
  modelName,
  ids,
  /* istanbul ignore next */
  kwargs = {}
}: CreateDeleteParams): Delete => {
  const unlink: Delete = {
    controllerType: 'http',
    kind: 'delete',
    serviceType: 'model',
    path: '/web/dataset/call_kw',
    params: {
      args: [ids],
      kwargs: kwargs,
      method: 'unlink',
      model: modelName
    },
    sessionToken
  }

  return unlink
}
