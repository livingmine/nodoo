import { JSONRPCOperation } from './jsonrpc/operations/operation'
import { HTTPOperation } from './http/operations/operation'

export { jsonController } from './jsonrpc/jsonrpc'
export { httpController } from './http/http'
export type ServiceOperation = JSONRPCOperation | HTTPOperation
export type ServiceOperationResult = any
