import { BaseCommonJSONRPCOperation } from './common'

export interface GetVersion extends BaseCommonJSONRPCOperation {
  kind: 'getVersion'
}

export const createGetVersion = (): GetVersion => {
  const getVersion: GetVersion = {
    controllerType: 'jsonrpc',
    serviceType: 'common',
    kind: 'getVersion',
    path: '/jsonrpc',
    serviceArgs: {
      method: 'version',
      methodArgs: {},
      service: 'common'
    }
  }

  return getVersion
}
