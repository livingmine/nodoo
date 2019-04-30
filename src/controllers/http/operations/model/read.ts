import { BaseModelHTTPOperation, BaseModelHTTPOperationParams } from './model'

export interface Read extends BaseModelHTTPOperation {
  kind: 'read'

  params: {
    model: string
    method: 'read'
    args: Array<any>
    kwargs: any
  }
}

export interface CreateReadParams extends BaseModelHTTPOperationParams {
  modelName: string
  ids: Array<number>
  fields?: Array<string>
}

export const createReadWithSessionToken = (sessionToken: string) => ({
  modelName,
  ids,
  fields = [],
  /* istanbul ignore next */
  kwargs = {}
}: CreateReadParams): Read => {
  const read: Read = {
    controllerType: 'http',
    kind: 'read',
    serviceType: 'model',
    params: {
      args: [ids, fields],
      kwargs: kwargs,
      method: 'read',
      model: modelName
    },
    path: '/web/dataset/call_kw',
    sessionToken
  }

  return read
}
