import {
  BaseModelJSONRPCOperation,
  Merge,
  ObjectServiceArgs,
  BaseModelJSONRPCOperationParams,
  ObjectMethodArgs,
  Credentials
} from './model'

export interface Update extends BaseModelJSONRPCOperation {
  kind: 'update'
  serviceArgs: Merge<
    ObjectServiceArgs,
    {
      methodArgs: Merge<
        ObjectMethodArgs,
        {
          modelMethod: 'write'
        }
      >
    }
  >
}

export interface CreateUpdateParams extends BaseModelJSONRPCOperationParams {
  fieldsValues: any
  ids: Array<number>
}

export const createUpdateWithCredentials = (credentials: Credentials) => ({
  modelName,
  ids,
  fieldsValues,
  /* istanbul ignore next */
  kwargs = {}
}: CreateUpdateParams): Update => {
  const update: Update = {
    credentials,
    controllerType: 'jsonrpc',
    serviceType: 'object',
    kind: 'update',
    path: '/jsonrpc',
    serviceArgs: {
      service: 'object',
      method: 'execute_kw',
      methodArgs: {
        ...credentials,
        model: modelName,
        modelMethod: 'write',
        modelMethodArgs: [ids, fieldsValues],
        modelMethodKwargs: kwargs
      }
    }
  }

  return update
}
