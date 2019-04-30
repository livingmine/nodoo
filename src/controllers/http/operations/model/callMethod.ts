import { BaseModelHTTPOperation, BaseModelHTTPOperationParams } from './model'

export interface CallMethod extends BaseModelHTTPOperation {
  kind: 'callMethod'
  params: {
    model: string
    method: string
    args: Array<any>
    kwargs: any
  }
}

export interface CreateCallMethodParams extends BaseModelHTTPOperationParams {
  modelName: string
  methodName: string
  args: Array<any>
}

export const createCallMethodWithSessionToken = (sessionToken: string) => ({
  modelName,
  methodName,
  args,
  /* istanbul ignore next */
  kwargs = {}
}: CreateCallMethodParams): CallMethod => {
  const callMethod: CallMethod = {
    controllerType: 'http',
    kind: 'callMethod',
    serviceType: 'model',
    params: {
      args,
      kwargs: kwargs,
      method: methodName,
      model: modelName
    },
    path: '/web/dataset/call_kw',
    sessionToken
  }

  return callMethod
}
