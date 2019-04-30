import { AuthUserCredentials } from './operations/operation'
import { createCreateWithSessionToken, CreateCreateParams, Create } from './operations/model/create'
import { CreateDeleteParams, Delete, createDeleteWithSessionToken } from './operations/model/delete'
import { CreateReadParams, Read, createReadWithSessionToken } from './operations/model/read'
import { CreateSearchParams, Search, createSearchWithSessionToken } from './operations/model/search'
import {
  CreateSearchCountParams,
  SearchCount,
  createSearchCountWithSessionToken
} from './operations/model/searchCount'
import {
  CreateSearchReadParams,
  SearchRead,
  createSearchReadWithSessionToken
} from './operations/model/searchRead'
import { CreateUpdateParams, Update, createUpdateWithSessionToken } from './operations/model/update'
import {
  CreateNameSearchParams,
  NameSearch,
  createNameSearchWithSessionToken
} from './operations/model/nameSearch'
import {
  CreateDefaultGetParams,
  DefaultGet,
  createDefaultGetWithSessionToken
} from './operations/model/defaultGet'
import {
  CreateFieldsGetParams,
  FieldsGet,
  createFieldsGetWithSessionToken
} from './operations/model/fieldsGet'
import {
  CreateNameGetParams,
  NameGet,
  createNameGetWithSessionToken
} from './operations/model/nameGet'
import {
  CreateOnChangeParams,
  OnChange,
  createOnChangeWithSessionToken
} from './operations/model/onChange'
import {
  CreateCallMethodParams,
  CallMethod,
  createCallMethodWithSessionToken
} from './operations/model/callMethod'
import {
  CreateAuthenticateParams,
  Authenticate,
  createAuthenticate
} from './operations/session/authenticate'
import { GetVersion, createGetVersion } from './operations/session/getVersion'
import { Modules, createModulesWithSessionToken } from './operations/session/modules'
import {
  GetSessionInfo,
  createGetSessionInfoWithSessionToken
} from './operations/session/getSessionInfo'

interface ModelHTTPOperationCreator {
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

interface AuthNoneSessionHTTPOperationCreator {
  createAuthenticate(createAuthenticate: CreateAuthenticateParams): Authenticate
  createGetVersion(): GetVersion
}

interface AuthUserSessionHTTPOperationCreator {
  createModules(): Modules
  createGetSessionInfo(): GetSessionInfo
}

interface SessionHTTPOperationCreator {
  authUser(credentials: AuthUserCredentials): AuthUserSessionHTTPOperationCreator
  authNone: AuthNoneSessionHTTPOperationCreator
}

export interface HTTP {
  kind: 'http'
  operation: {
    dataSet(credentials: AuthUserCredentials): ModelHTTPOperationCreator
    session: SessionHTTPOperationCreator
  }
}

export const httpController = (): HTTP => ({
  kind: 'http',
  operation: {
    dataSet: ({ sessionToken }: AuthUserCredentials) => ({
      createCreate: createCreateWithSessionToken(sessionToken),
      createDelete: createDeleteWithSessionToken(sessionToken),
      createRead: createReadWithSessionToken(sessionToken),
      createCallMethod: createCallMethodWithSessionToken(sessionToken),
      createDefaultGet: createDefaultGetWithSessionToken(sessionToken),
      createFieldsGet: createFieldsGetWithSessionToken(sessionToken),
      createNameGet: createNameGetWithSessionToken(sessionToken),
      createNameSearch: createNameSearchWithSessionToken(sessionToken),
      createOnChange: createOnChangeWithSessionToken(sessionToken),
      createSearch: createSearchWithSessionToken(sessionToken),
      createSearchCount: createSearchCountWithSessionToken(sessionToken),
      createSearchRead: createSearchReadWithSessionToken(sessionToken),
      createUpdate: createUpdateWithSessionToken(sessionToken)
    }),
    session: {
      authNone: {
        createAuthenticate,
        createGetVersion
      },
      authUser: ({ sessionToken }: AuthUserCredentials) => ({
        createModules: createModulesWithSessionToken(sessionToken),
        createGetSessionInfo: createGetSessionInfoWithSessionToken(sessionToken)
      })
    }
  }
})
