import { BaseModelHTTPOperationParams, BaseModelHTTPOperation } from './model'

export interface CreateCreateParams extends BaseModelHTTPOperationParams {
  fieldsValues: any
}

export interface Create extends BaseModelHTTPOperation {
  kind: 'create'

  params: {
    model: string
    method: 'create'
    args: Array<any>
    kwargs: any
  }
}

export const createCreateWithSessionToken = (sessionToken: string) => ({
  modelName,
  fieldsValues,
  /* istanbul ignore next */
  kwargs = {}
}: CreateCreateParams): Create => {
  const create: Create = {
    controllerType: 'http',
    kind: 'create',
    serviceType: 'model',
    path: '/web/dataset/call_kw',
    params: {
      args: [fieldsValues],
      kwargs: kwargs,
      method: 'create',
      model: modelName
    },
    sessionToken
  }

  return create
}
