import {
  BaseModelJSONRPCOperation,
  Merge,
  ObjectServiceArgs,
  BaseModelJSONRPCOperationParams,
  ObjectMethodArgs,
  Credentials
} from './model'

export interface OnChange extends BaseModelJSONRPCOperation {
  kind: 'onChange'
  serviceArgs: Merge<
    ObjectServiceArgs,
    {
      methodArgs: Merge<
        ObjectMethodArgs,
        {
          modelMethod: 'onchange'
        }
      >
    }
  >
}

export interface CreateOnChangeParams extends BaseModelJSONRPCOperationParams {
  modelName: string
  values: any
  fieldName: Array<string>
  fieldOnChange: any
}

export const createOnChangeWithCredentials = (credentials: Credentials) => ({
  modelName,
  values,
  fieldName,
  fieldOnChange,
  /* istanbul ignore next */
  kwargs = {}
}: CreateOnChangeParams): OnChange => {
  const onChange: OnChange = {
    credentials,
    controllerType: 'jsonrpc',
    serviceType: 'object',
    kind: 'onChange',
    path: '/jsonrpc',
    serviceArgs: {
      service: 'object',
      method: 'execute_kw',
      methodArgs: {
        ...credentials,
        model: modelName,
        modelMethod: 'onchange',
        modelMethodArgs: [[], values, fieldName, fieldOnChange],
        modelMethodKwargs: kwargs
      }
    }
  }

  return onChange
}
