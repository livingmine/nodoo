import { BaseModelHTTPOperation, BaseModelHTTPOperationParams } from './model'

export interface OnChange extends BaseModelHTTPOperation {
  kind: 'onChange'
  params: {
    model: string
    method: 'onchange'
    args: Array<any>
    kwargs: any
  }
}

export interface CreateOnChangeParams extends BaseModelHTTPOperationParams {
  modelName: string
  values: any
  fieldName: Array<string>
  fieldOnChange: any
}

export const createOnChangeWithSessionToken = (sessionToken: string) => ({
  modelName,
  values,
  fieldName,
  fieldOnChange,
  /* istanbul ignore next */
  kwargs = {}
}: CreateOnChangeParams): OnChange => {
  const onChange: OnChange = {
    controllerType: 'http',
    kind: 'onChange',
    serviceType: 'model',
    params: {
      args: [[], values, fieldName, fieldOnChange],
      kwargs: kwargs,
      method: 'onchange',
      model: modelName
    },
    path: '/web/dataset/call_kw',
    sessionToken
  }

  return onChange
}
