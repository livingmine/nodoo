import { Credentials as DataSetCredentials, createCredentials } from './operations/model/model'
import { CreateCreateParams, Create, createCreateWithCredentials } from './operations/model/create'
import { CreateDeleteParams, Delete, createDeleteWithCredentials } from './operations/model/delete'
import { CreateReadParams, Read, createReadWithCredentials } from './operations/model/read'
import {
  NameSearch,
  CreateNameSearchParams,
  createNameSearchWithCredentials
} from './operations/model/nameSearch'
import {
  DefaultGet,
  CreateDefaultGetParams,
  createDefaultGetWithCredentials
} from './operations/model/defaultGet'
import {
  FieldsGet,
  CreateFieldsGetParams,
  createFieldsGetWithCredentials
} from './operations/model/fieldsGet'
import {
  NameGet,
  CreateNameGetParams,
  createNameGetWithCredentials
} from './operations/model/nameGet'
import {
  OnChange,
  CreateOnChangeParams,
  createOnChangeWithCredentials
} from './operations/model/onChange'
import {
  CallMethod,
  CreateCallMethodParams,
  createCallMethodWithCredentials
} from './operations/model/callMethod'
import { CreateSearchParams, Search, createSearchWithCredentials } from './operations/model/search'
import {
  CreateSearchCountParams,
  SearchCount,
  createSearchCountWithCredentials
} from './operations/model/searchCount'
import {
  CreateSearchReadParams,
  SearchRead,
  createSearchReadWithCredentials
} from './operations/model/searchRead'
import { Update, CreateUpdateParams, createUpdateWithCredentials } from './operations/model/update'
import { Credentials as DatabaseCredentials } from './operations/database/database'
import {
  CreateDB,
  CreateCreateDBParams,
  createCreateDBWithAdminPassword
} from './operations/database/createDB'
import {
  CreateDuplicateDBParams,
  DuplicateDB,
  createDuplicateDBWithAdminPassword
} from './operations/database/duplicateDB'
import { CreateDBExistParams, DBExist, createDBExist } from './operations/database/dbExist'
import { createListDB, ListDB } from './operations/database/listDB'
import {
  CreateAuthenticateParams,
  Authenticate,
  createAuthenticate
} from './operations/common/authenticate'
import { createGetVersion, GetVersion } from './operations/common/getVersion'
import {
  CreateDropDBParams,
  DropDB,
  createDropDBWithAdminPassword
} from './operations/database/dropDB'

interface ModelJSONRPCOperationCreator {
  createCreate(createCreateParams: CreateCreateParams): Create
  createDelete(createDeleteParams: CreateDeleteParams): Delete
  createRead(createReadParams: CreateReadParams): Read
  createSearch(createSearchParams: CreateSearchParams): Search
  createSearchCount(createSearchCountParams: CreateSearchCountParams): SearchCount
  createSearchRead(createSearchReadParams: CreateSearchReadParams): SearchRead
  createUpdate(createUpdateParams: CreateUpdateParams): Update
  createNameSearch(createNameSearchParams: CreateNameSearchParams): NameSearch
  createDefaultGet(createDefaultGetParams: CreateDefaultGetParams): DefaultGet
  createFieldsGet(createFieldsGetParams: CreateFieldsGetParams): FieldsGet
  createNameGet(createNameGetParams: CreateNameGetParams): NameGet
  createOnChange(createOnChangeParams: CreateOnChangeParams): OnChange
  createCallMethod(createCallMethodParams: CreateCallMethodParams): CallMethod
}

interface ProtectedDBJSONRPCOperationCreator {
  createCreateDB(createCreateDBParams: CreateCreateDBParams): CreateDB
  createDuplicateDB(createDuplicateDBParams: CreateDuplicateDBParams): DuplicateDB
  createDropDB(createDropDBParams: CreateDropDBParams): DropDB
}

interface PublicDBJSONRPCOperationCreator {
  createDBExist(createDBExistParams: CreateDBExistParams): DBExist
  createListDB(): ListDB
}

interface CommonJSONRPCOperationCreateor {
  createAuthenticate(createAuthenticate: CreateAuthenticateParams): Authenticate
  createGetVersion(): GetVersion
}

interface JSONRPC {
  kind: 'jsonrpc'
  operation: {
    databasePublic: PublicDBJSONRPCOperationCreator
    databaseProtected(credentials: DatabaseCredentials): ProtectedDBJSONRPCOperationCreator
    dataSet(credentials: DataSetCredentials): ModelJSONRPCOperationCreator
    common: CommonJSONRPCOperationCreateor
  }
}

export const jsonController = (): JSONRPC => ({
  kind: 'jsonrpc',
  operation: {
    databaseProtected: ({ adminPassword }: DatabaseCredentials) => ({
      createCreateDB: createCreateDBWithAdminPassword(adminPassword),
      createDuplicateDB: createDuplicateDBWithAdminPassword(adminPassword),
      createDropDB: createDropDBWithAdminPassword(adminPassword)
    }),
    databasePublic: {
      createDBExist,
      createListDB
    },
    dataSet: (credentials: DataSetCredentials) => ({
      createCreate: createCreateWithCredentials(createCredentials(credentials)),
      createDelete: createDeleteWithCredentials(createCredentials(credentials)),
      createRead: createReadWithCredentials(createCredentials(credentials)),
      createCallMethod: createCallMethodWithCredentials(createCredentials(credentials)),
      createDefaultGet: createDefaultGetWithCredentials(createCredentials(credentials)),
      createFieldsGet: createFieldsGetWithCredentials(createCredentials(credentials)),
      createNameGet: createNameGetWithCredentials(createCredentials(credentials)),
      createNameSearch: createNameSearchWithCredentials(createCredentials(credentials)),
      createOnChange: createOnChangeWithCredentials(createCredentials(credentials)),
      createSearch: createSearchWithCredentials(createCredentials(credentials)),
      createSearchCount: createSearchCountWithCredentials(createCredentials(credentials)),
      createSearchRead: createSearchReadWithCredentials(createCredentials(credentials)),
      createUpdate: createUpdateWithCredentials(createCredentials(credentials))
    }),
    common: {
      createAuthenticate,
      createGetVersion
    }
  }
})
