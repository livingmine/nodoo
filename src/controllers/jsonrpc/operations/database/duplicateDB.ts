import { BaseDBJSONRPCOperation } from './database'

export interface DuplicateDB extends BaseDBJSONRPCOperation {
  kind: 'dbDuplicateDatabase'
}

export type CreateDuplicateDBParams = {
  dbOriginalName: string
  dbName: string
}

export const createDuplicateDBWithAdminPassword = (adminPassword: string) => ({
  dbOriginalName,
  dbName
}: CreateDuplicateDBParams): DuplicateDB => {
  const duplicateDB: DuplicateDB = {
    controllerType: 'jsonrpc',
    serviceType: 'db',
    kind: 'dbDuplicateDatabase',
    serviceArgs: {
      method: 'duplicate_database',
      methodArgs: [adminPassword, dbOriginalName, dbName],
      service: 'db'
    },
    path: '/jsonrpc'
  }

  return duplicateDB
}
