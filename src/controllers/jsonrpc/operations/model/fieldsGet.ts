import {
  BaseModelJSONRPCOperation,
  ObjectServiceArgs,
  Merge,
  BaseModelJSONRPCOperationParams,
  ObjectMethodArgs,
  Credentials
} from './model'

export interface FieldsGet extends BaseModelJSONRPCOperation {
  kind: 'fieldsGet'
  serviceArgs: Merge<
    ObjectServiceArgs,
    {
      methodArgs: Merge<
        ObjectMethodArgs,
        {
          modelMethod: 'fields_get'
        }
      >
    }
  >
}

export interface CreateFieldsGetParams extends BaseModelJSONRPCOperationParams {
  fieldsNames?: Array<string>
  attributes?: Array<string>
}

export const createFieldsGetWithCredentials = (credentials: Credentials) => ({
  modelName,
  fieldsNames = [],
  /* istanbul ignore next */
  attributes = [],
  /* istanbul ignore next */
  kwargs = {}
}: CreateFieldsGetParams): FieldsGet => {
  const fieldsGet: FieldsGet = {
    credentials,
    controllerType: 'jsonrpc',
    serviceType: 'object',
    kind: 'fieldsGet',
    path: '/jsonrpc',
    serviceArgs: {
      service: 'object',
      method: 'execute_kw',
      methodArgs: {
        ...credentials,
        model: modelName,
        modelMethod: 'fields_get',
        modelMethodArgs: [fieldsNames, attributes],
        modelMethodKwargs: kwargs
      }
    }
  }

  return fieldsGet
}
