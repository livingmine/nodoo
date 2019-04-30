import {
  BaseModelJSONRPCOperation,
  Merge,
  ObjectServiceArgs,
  ObjectMethodArgs,
  BaseModelJSONRPCOperationParams,
  Credentials
} from './model'

export interface Read extends BaseModelJSONRPCOperation {
  kind: 'read'
  serviceArgs: Merge<
    ObjectServiceArgs,
    {
      methodArgs: Merge<
        ObjectMethodArgs,
        {
          modelMethod: 'read'
        }
      >
    }
  >
}

export interface CreateReadParams extends BaseModelJSONRPCOperationParams {
  modelName: string
  ids: Array<number>
  fields?: Array<string>
}

export const createReadWithCredentials = (credentials: Credentials) => ({
  modelName,
  ids,
  fields = [],
  /* istanbul ignore next */
  kwargs = {}
}: CreateReadParams): Read => {
  const read: Read = {
    controllerType: 'jsonrpc',
    serviceType: 'object',
    credentials,
    kind: 'read',
    path: '/jsonrpc',
    serviceArgs: {
      service: 'object',
      method: 'execute_kw',
      methodArgs: {
        ...credentials,
        model: modelName,
        modelMethod: 'read',
        modelMethodArgs: [ids, fields],
        modelMethodKwargs: kwargs
      }
    }
  }

  return read
}
