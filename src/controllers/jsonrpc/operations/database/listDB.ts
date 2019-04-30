import { BaseDBJSONRPCOperation } from './database'

export interface ListDB extends BaseDBJSONRPCOperation {
  kind: 'dbList'
}

export const createListDB = (): ListDB => {
  const listDB: ListDB = {
    serviceType: 'db',
    controllerType: 'jsonrpc',
    kind: 'dbList',
    serviceArgs: {
      method: 'list',
      methodArgs: [],
      service: 'db'
    },
    path: '/jsonrpc'
  }

  return listDB
}
