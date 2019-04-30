import { BaseHTTPOperation } from '../operation'
import { Authenticate } from './authenticate'
import { GetVersion } from './getVersion'
import { Modules } from './modules'
import { GetSessionInfo } from './getSessionInfo'

export interface BaseSessionHTTPOperation extends BaseHTTPOperation {
  serviceType: 'session'
}

export type SessionHTTPOperation = Authenticate | GetVersion | GetSessionInfo | Modules
