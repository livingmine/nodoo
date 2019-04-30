import { ModelHTTPOperation } from './model/model'
import { SessionHTTPOperation } from './session/session'

export interface BaseHTTPOperation {
  controllerType: 'http'
}

export type HTTPOperation = SessionHTTPOperation | ModelHTTPOperation

export type AuthUserCredentials = {
  sessionToken: string
}
