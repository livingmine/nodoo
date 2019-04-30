import { BaseModelHTTPOperation, BaseModelHTTPOperationParams } from './model'

export interface Update extends BaseModelHTTPOperation {
  kind: 'update'
  params: {
    model: string
    method: 'write'
    args: Array<any>
    kwargs: any
  }
}

export interface CreateUpdateParams extends BaseModelHTTPOperationParams {
  fieldsValues: any
  ids: Array<number>
}

export const createUpdateWithSessionToken = (sessionToken: string) => ({
  modelName,
  ids,
  fieldsValues,
  /* istanbul ignore next */
  kwargs = {}
}: CreateUpdateParams): Update => {
  const update: Update = {
    controllerType: 'http',
    kind: 'update',
    serviceType: 'model',
    params: {
      args: [ids, fieldsValues],
      kwargs: kwargs,
      method: 'write',
      model: modelName
    },
    path: '/web/dataset/call_kw',
    sessionToken
  }

  return update
}
