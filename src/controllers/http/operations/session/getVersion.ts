import { BaseSessionHTTPOperation } from './session'

export interface GetVersion extends BaseSessionHTTPOperation {
  kind: 'getVersion'
  path: '/web/webclient/version_info'
}

export const createGetVersion = (): GetVersion => {
  const getVersion: GetVersion = {
    controllerType: 'http',
    kind: 'getVersion',
    serviceType: 'session',
    path: '/web/webclient/version_info'
  }

  return getVersion
}
