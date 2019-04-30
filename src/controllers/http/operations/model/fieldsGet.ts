import { BaseModelHTTPOperation, BaseModelHTTPOperationParams } from './model'

export interface FieldsGet extends BaseModelHTTPOperation {
  kind: 'fieldsGet'
  params: {
    model: string
    method: 'fields_get'
    args: Array<any>
    kwargs: any
  }
}

export interface CreateFieldsGetParams extends BaseModelHTTPOperationParams {
  fieldsNames?: Array<string>
  attributes?: Array<string>
}

export const createFieldsGetWithSessionToken = (sessionToken: string) => ({
  modelName,
  fieldsNames = [],
  /* istanbul ignore next */
  attributes = [],
  /* istanbul ignore next */
  kwargs = {}
}: CreateFieldsGetParams): FieldsGet => {
  const fieldsGet: FieldsGet = {
    controllerType: 'http',
    kind: 'fieldsGet',
    serviceType: 'model',
    params: {
      args: [fieldsNames, attributes],
      kwargs: kwargs,
      method: 'fields_get',
      model: modelName
    },
    path: '/web/dataset/call_kw',
    sessionToken
  }

  return fieldsGet
}
