import { BaseDBJSONRPCOperation } from './database'

export interface CreateDB extends BaseDBJSONRPCOperation {
  kind: 'dbCreateDatabase'
}

export type CreateCreateDBParams = {
  dbName: string
  demo: boolean
  lang: string
  userPassword: string
  login: string
  countryCode: string
}

export const createCreateDBWithAdminPassword = (adminPassword: string) => ({
  dbName,
  demo,
  lang,
  userPassword,
  login,
  countryCode
}: CreateCreateDBParams): CreateDB => {
  const createDB: CreateDB = {
    kind: 'dbCreateDatabase',
    controllerType: 'jsonrpc',
    serviceType: 'db',
    serviceArgs: {
      method: 'create_database',
      methodArgs: [adminPassword, dbName, demo, lang, userPassword, login, countryCode],
      service: 'db'
    },
    path: '/jsonrpc'
  }

  return createDB
}
