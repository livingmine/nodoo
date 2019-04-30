import { BaseHTTPOperation } from '../operation'
import { Create } from './create'
import { Delete } from './delete'
import { Read } from './read'
import { Search } from './search'
import { SearchCount } from './searchCount'
import { SearchRead } from './searchRead'
import { NameSearch } from './nameSearch'
import { Update } from './update'
import { DefaultGet } from './defaultGet'
import { FieldsGet } from './fieldsGet'
import { NameGet } from './nameGet'
import { OnChange } from './onChange'
import { CallMethod } from './callMethod'

export interface BaseModelHTTPOperation extends BaseHTTPOperation {
  serviceType: 'model'
  path: '/web/dataset/call_kw'
  sessionToken: string
}

export interface BaseModelHTTPOperationParams {
  modelName: string
  kwargs?: object
}

export type ModelHTTPOperation =
  | Create
  | Delete
  | Read
  | Search
  | SearchCount
  | SearchRead
  | NameSearch
  | Update
  | DefaultGet
  | FieldsGet
  | NameGet
  | OnChange
  | CallMethod
