import { ModelJSONRPCOperation } from './model/model'
import { CommonJSONRPCOperation } from './common/common'
import { DBJSONRPCOperation } from './database/database'

export interface BaseJSONRPCOperation {
  controllerType: 'jsonrpc'
  path: '/jsonrpc'
}

export type JSONRPCOperation = CommonJSONRPCOperation | DBJSONRPCOperation | ModelJSONRPCOperation
