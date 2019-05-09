import { BaseJSONRPCOperation } from '../operation'
import { BaseServiceArgs } from '../model/model'
import { DBExist } from './dbExist'
import { ListDB } from './listDB'
import { CreateDB } from './createDB'
import { DuplicateDB } from './duplicateDB'
import { DropDB } from './dropDB'

export type Credentials = {
  adminPassword: string
}

type DBMethodArgs = Array<any>

interface DBServiceAargs extends BaseServiceArgs {
  service: 'db'
  method: 'db_exist' | 'list' | 'create_database' | 'duplicate_database' | 'drop'
  methodArgs: DBMethodArgs
}

export interface BaseDBJSONRPCOperation extends BaseJSONRPCOperation {
  serviceType: 'db'
  serviceArgs: DBServiceAargs
}

type ProtectedDBJSONRPCOperation = CreateDB | DuplicateDB | DropDB
type PublicDBJSONRPCOperation = DBExist | ListDB
export type DBJSONRPCOperation = ProtectedDBJSONRPCOperation | PublicDBJSONRPCOperation
