import {
  BaseModelJSONRPCOperation,
  Merge,
  ObjectServiceArgs,
  BaseModelJSONRPCOperationParams,
  ObjectMethodArgs,
  Credentials
} from './model'

export interface NameGet extends BaseModelJSONRPCOperation {
  kind: 'nameGet'
  serviceArgs: Merge<
    ObjectServiceArgs,
    {
      methodArgs: Merge<
        ObjectMethodArgs,
        {
          modelMethod: 'name_get'
        }
      >
    }
  >
}

export interface CreateNameGetParams extends BaseModelJSONRPCOperationParams {
  modelName: string
  ids: Array<number>
}

export const createNameGetWithCredentials = (credentials: Credentials) => ({
  modelName,
  ids,
  /* istanbul ignore next */
  kwargs = {}
}: CreateNameGetParams): NameGet => {
  const nameGet: NameGet = {
    credentials,
    controllerType: 'jsonrpc',
    serviceType: 'object',
    kind: 'nameGet',
    path: '/jsonrpc',
    serviceArgs: {
      service: 'object',
      method: 'execute_kw',
      methodArgs: {
        ...credentials,
        model: modelName,
        modelMethod: 'name_get',
        modelMethodArgs: [ids],
        modelMethodKwargs: kwargs
      }
    }
  }

  return nameGet
}
