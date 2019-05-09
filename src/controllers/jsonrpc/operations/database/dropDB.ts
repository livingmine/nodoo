import { BaseDBJSONRPCOperation } from './database'

export interface DropDB extends BaseDBJSONRPCOperation {
  kind: 'dbDropDatabase'
}

export type CreateDropDBParams = {
  dbName: string
}

export const createDropDBWithAdminPassword = (adminPassword: string) => ({
  dbName
}: CreateDropDBParams): DropDB => {
  const dropDB: DropDB = {
    kind: 'dbDropDatabase',
    controllerType: 'jsonrpc',
    serviceType: 'db',
    serviceArgs: {
      method: 'drop',
      methodArgs: [adminPassword, dbName],
      service: 'db'
    },
    path: '/jsonrpc'
  }

  return dropDB
}
