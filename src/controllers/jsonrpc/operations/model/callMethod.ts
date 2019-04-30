import {
  BaseModelJSONRPCOperation,
  ObjectServiceArgs,
  BaseModelJSONRPCOperationParams,
  Credentials
} from './model'

export interface CallMethod extends BaseModelJSONRPCOperation {
  kind: 'callMethod'
  serviceArgs: ObjectServiceArgs
}

export interface CreateCallMethodParams extends BaseModelJSONRPCOperationParams {
  modelName: string
  methodName: string
  args: Array<any>
}

export const createCallMethodWithCredentials = (credentials: Credentials) => ({
  modelName,
  methodName,
  args,
  /* istanbul ignore next */
  kwargs = {}
}: CreateCallMethodParams): CallMethod => {
  const callMethod: CallMethod = {
    credentials,
    controllerType: 'jsonrpc',
    serviceType: 'object',
    kind: 'callMethod',
    path: '/jsonrpc',
    serviceArgs: {
      service: 'object',
      method: 'execute_kw',
      methodArgs: {
        ...credentials,
        model: modelName,
        modelMethod: methodName,
        modelMethodArgs: args,
        modelMethodKwargs: kwargs
      }
    }
  }

  return callMethod
}
