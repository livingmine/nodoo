import { BaseSessionHTTPOperation } from './session'

export interface Authenticate extends BaseSessionHTTPOperation {
  kind: 'authenticate'
  params: AuthenticateParams
  path: '/web/session/authenticate'
}

export interface CreateAuthenticateParams {
  db: string
  login: string
  password: string
}

interface AuthenticateParams {
  db: string
  login: string
  password: string
}

// Reorder to make sure the order of the keys
const reorderAuthenticateParams = ({
  db,
  login,
  password
}: CreateAuthenticateParams): AuthenticateParams => ({
  db,
  login,
  password
})

export const createAuthenticate = (authenticateParams: CreateAuthenticateParams): Authenticate => {
  const authenticate: Authenticate = {
    controllerType: 'http',
    kind: 'authenticate',
    serviceType: 'session',
    params: reorderAuthenticateParams(authenticateParams),
    path: '/web/session/authenticate'
  }

  return authenticate
}
