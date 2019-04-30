import { BaseDBJSONRPCOperation } from './database'

export interface DBExist extends BaseDBJSONRPCOperation {
  kind: 'dbExist'
}

export type CreateDBExistParams = {
  dbName: string
}

export const createDBExist = ({ dbName }: CreateDBExistParams): DBExist => {
  const dbExist: DBExist = {
    controllerType: 'jsonrpc',
    kind: 'dbExist',
    serviceType: 'db',
    serviceArgs: {
      method: 'db_exist',
      methodArgs: [dbName],
      service: 'db'
    },
    path: '/jsonrpc'
  }

  return dbExist
}
