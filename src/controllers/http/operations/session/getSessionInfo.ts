import { BaseSessionHTTPOperation } from './session'

export interface GetSessionInfo extends BaseSessionHTTPOperation {
  kind: 'getSessionInfo'
  path: '/web/session/get_session_info'
  sessionToken: string
}

export const createGetSessionInfoWithSessionToken = (
  sessionToken: string
) => (): GetSessionInfo => {
  const getSessionInfo: GetSessionInfo = {
    controllerType: 'http',
    kind: 'getSessionInfo',
    serviceType: 'session',
    path: '/web/session/get_session_info',
    sessionToken
  }

  return getSessionInfo
}
