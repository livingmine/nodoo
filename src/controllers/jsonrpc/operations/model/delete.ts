import {
  BaseModelJSONRPCOperationParams,
  BaseModelJSONRPCOperation,
  Merge,
  ObjectServiceArgs,
  Credentials,
  ObjectMethodArgs
} from './model'

export interface Delete extends BaseModelJSONRPCOperation {
  kind: 'delete'
  serviceArgs: Merge<
    ObjectServiceArgs,
    {
      methodArgs: Merge<
        ObjectMethodArgs,
        {
          modelMethod: 'unlink'
        }
      >
    }
  >
}

export interface CreateDeleteParams extends BaseModelJSONRPCOperationParams {
  ids: Array<number>
}

export const createDeleteWithCredentials = (credentials: Credentials) => ({
  modelName,
  ids,
  /* istanbul ignore next */
  kwargs = {}
}: CreateDeleteParams): Delete => {
  const unlink: Delete = {
    controllerType: 'jsonrpc',
    credentials,
    serviceType: 'object',
    kind: 'delete',
    path: '/jsonrpc',
    serviceArgs: {
      service: 'object',
      method: 'execute_kw',
      methodArgs: {
        ...credentials,
        model: modelName,
        modelMethod: 'unlink',
        modelMethodArgs: [ids],
        modelMethodKwargs: kwargs
      }
    }
  }

  return unlink
}
