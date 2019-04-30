import { BaseSessionHTTPOperation } from './session'

export interface Modules extends BaseSessionHTTPOperation {
  kind: 'modules'
  path: '/web/session/modules'
  sessionToken: string
}

export const createModulesWithSessionToken = (sessionToken: string) => (): Modules => {
  const modules: Modules = {
    controllerType: 'http',
    kind: 'modules',
    serviceType: 'session',
    path: '/web/session/modules',
    sessionToken
  }

  return modules
}
