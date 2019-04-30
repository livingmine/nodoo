import {
  BaseModelJSONRPCOperation,
  ObjectServiceArgs,
  Merge,
  ObjectMethodArgs,
  BaseModelJSONRPCOperationParams,
  Credentials
} from './model'

export interface Create extends BaseModelJSONRPCOperation {
  kind: 'create'
  serviceArgs: Merge<
    ObjectServiceArgs,
    {
      methodArgs: Merge<
        ObjectMethodArgs,
        {
          modelMethod: 'create'
        }
      >
    }
  >
}

export interface CreateCreateParams extends BaseModelJSONRPCOperationParams {
  fieldsValues: any
}

export const createCreateWithCredentials = (credentials: Credentials) => ({
  modelName,
  fieldsValues,
  /* istanbul ignore next */
  kwargs = {}
}: CreateCreateParams): Create => {
  const create: Create = {
    credentials,
    controllerType: 'jsonrpc',
    kind: 'create',
    path: '/jsonrpc',
    serviceType: 'object',
    serviceArgs: {
      service: 'object',
      method: 'execute_kw',
      methodArgs: {
        ...credentials,
        model: modelName,
        modelMethod: 'create',
        modelMethodArgs: [fieldsValues],
        modelMethodKwargs: kwargs
      }
    }
  }

  return create
}
