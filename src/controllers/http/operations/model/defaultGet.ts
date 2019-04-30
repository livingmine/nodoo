import { BaseModelHTTPOperation, BaseModelHTTPOperationParams } from './model'

export interface DefaultGet extends BaseModelHTTPOperation {
  kind: 'defaultGet'
  params: {
    model: string
    method: 'default_get'
    args: Array<any>
    kwargs: any
  }
}

export interface CreateDefaultGetParams extends BaseModelHTTPOperationParams {
  fieldsNames: Array<string>
}

export const createDefaultGetWithSessionToken = (sessionToken: string) => ({
  modelName,
  fieldsNames,
  /* istanbul ignore next */
  kwargs = {}
}: CreateDefaultGetParams): DefaultGet => {
  const defaultGet: DefaultGet = {
    controllerType: 'http',
    kind: 'defaultGet',
    serviceType: 'model',
    params: {
      args: [fieldsNames],
      kwargs: kwargs,
      method: 'default_get',
      model: modelName
    },
    path: '/web/dataset/call_kw',
    sessionToken
  }

  return defaultGet
}
