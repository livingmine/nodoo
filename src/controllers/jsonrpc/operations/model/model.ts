import { BaseJSONRPCOperation } from '../operation'
import { Create } from './create'
import { Delete } from './delete'
import { Read } from './read'
import { Search } from './search'
import { SearchCount } from './searchCount'
import { SearchRead } from './searchRead'
import { Update } from './update'
import { NameSearch } from './nameSearch'
import { DefaultGet } from './defaultGet'
import { FieldsGet } from './fieldsGet'
import { NameGet } from './nameGet'
import { OnChange } from './onChange'
import { CallMethod } from './callMethod'

export type Credentials = {
  db: string
  uid: number
  password: string
}

export interface BaseServiceArgs {
  service: 'common' | 'db' | 'object'
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N

export type ObjectMethodArgs = {
  db: string
  uid: number
  password: string
  model: string
  modelMethod: string
  modelMethodArgs: Array<any>
  modelMethodKwargs?: any
}

export interface ObjectServiceArgs extends BaseServiceArgs {
  service: 'object'
  method: 'execute_kw'
  methodArgs: ObjectMethodArgs
}

export interface BaseModelJSONRPCOperation extends BaseJSONRPCOperation {
  credentials: Credentials
  path: '/jsonrpc'
  serviceType: 'object'
}

export interface BaseModelJSONRPCOperationParams {
  modelName: string
  kwargs?: object
}

export type ModelJSONRPCOperation =
  | Create
  | Delete
  | Read
  | Search
  | SearchCount
  | SearchRead
  | Update
  | NameSearch
  | DefaultGet
  | FieldsGet
  | NameGet
  | OnChange
  | CallMethod

// We make sure the sequence is always db, uid and password as it will be passed as an args not a kwargs, so position matters.
export const createCredentials = ({ db, uid, password }: Credentials): Credentials => ({
  db,
  uid,
  password
})
