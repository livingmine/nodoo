import {
  BaseModelJSONRPCOperation,
  Merge,
  ObjectServiceArgs,
  BaseModelJSONRPCOperationParams,
  ObjectMethodArgs,
  Credentials
} from './model'

export interface DefaultGet extends BaseModelJSONRPCOperation {
  kind: 'defaultGet'
  serviceArgs: Merge<
    ObjectServiceArgs,
    {
      methodArgs: Merge<
        ObjectMethodArgs,
        {
          modelMethod: 'default_get'
        }
      >
    }
  >
}

export interface CreateDefaultGetParams extends BaseModelJSONRPCOperationParams {
  fieldsNames: Array<string>
}

export const createDefaultGetWithCredentials = (credentials: Credentials) => ({
  modelName,
  fieldsNames,
  /* istanbul ignore next */
  kwargs = {}
}: CreateDefaultGetParams): DefaultGet => {
  const defaultGet: DefaultGet = {
    credentials,
    controllerType: 'jsonrpc',
    serviceType: 'object',
    kind: 'defaultGet',
    path: '/jsonrpc',
    serviceArgs: {
      service: 'object',
      method: 'execute_kw',
      methodArgs: {
        ...credentials,
        model: modelName,
        modelMethod: 'default_get',
        modelMethodArgs: [fieldsNames],
        modelMethodKwargs: kwargs
      }
    }
  }

  return defaultGet
}
