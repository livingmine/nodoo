import { BaseCommonJSONRPCOperation } from './common'

interface AuthenticateParams {
  db: string
  login: string
  password: string
  dummy: {}
}

export interface Authenticate extends BaseCommonJSONRPCOperation {
  kind: 'authenticate'
}

export interface CreateAuthenticateParams {
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
  password,
  dummy: {}
})

export const createAuthenticate = (credentials: CreateAuthenticateParams): Authenticate => {
  const authenticate: Authenticate = {
    controllerType: 'jsonrpc',
    serviceType: 'common',
    kind: 'authenticate',
    serviceArgs: {
      method: 'authenticate',
      methodArgs: reorderAuthenticateParams(credentials),
      service: 'common'
    },
    path: '/jsonrpc'
  }

  return authenticate
}
