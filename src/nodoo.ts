import { Either, left, right } from 'fp-ts/lib/Either'
import 'cross-fetch/polyfill'
import xs, { Stream } from 'xstream'
import 'core-js/fn/object/values'

// Start of client
type Client = SecureClient | InsecureClient

interface BaseClient {
  client: Promise<Response>
}

interface SecureClient extends BaseClient {
  kind: 'secure'
}

interface InsecureClient extends BaseClient {
  kind: 'insecure'
}

type ClientOptions = SecureClientOptions | InsecureClientOptions

interface BaseClientOptions {
  host: string
}

interface InsecureClientOptions extends BaseClientOptions {
  kind: 'insecure'
  port: number
}

interface SecureClientOptions extends BaseClientOptions {
  kind: 'secure'
}

type SecureClientOptionsParams = {
  host: string
}

type InsecureClientOptionsParams = {
  host: string
  port: number
}

export const createSecureClientOptions = (
  clientOptionsParams: SecureClientOptionsParams
): SecureClientOptions => {
  const secureClientOptions: SecureClientOptions = {
    kind: 'secure',
    ...clientOptionsParams
  }
  return secureClientOptions
}

export const createInsecureClientOptions = (
  clientOptionsParams: InsecureClientOptionsParams
): InsecureClientOptions => {
  const insecureClientOptions: InsecureClientOptions = {
    kind: 'insecure',
    ...clientOptionsParams
  }
  return insecureClientOptions
}

type CreateClientParams = {
  clientOptions: ClientOptions
  operation: ServiceOperation
}

type CreateSecureClientParams = {
  clientOptions: SecureClientOptions
  operation: ServiceOperation
}

type CreateInsecureClientParams = {
  clientOptions: InsecureClientOptions
  operation: ServiceOperation
}

export const createSecureClient = ({
  clientOptions,
  operation
}: CreateSecureClientParams): SecureClient => {
  switch (operation.serviceType) {
    case 'common': {
      switch (operation.path) {
        case '/web/webclient/version_info': {
          const data = JSON.stringify({
            jsonrpc: '2.0',
            method: 'call',
            params: {}
          })
          return {
            kind: 'secure',
            client: fetch(`https://${clientOptions.host}${operation.path}`, {
              method: 'POST',
              body: data,
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Content-Length': data.length.toString()
              }
            })
          }
        }
        case '/web/session/authenticate': {
          const data = JSON.stringify({
            jsonrpc: '2.0',
            method: 'call',
            params: operation.params
          })
          return {
            kind: 'secure',
            client: fetch(`https://${clientOptions.host}${operation.path}`, {
              method: 'POST',
              body: data,
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Content-Length': data.length.toString()
              }
            })
          }
        }
        /* istanbul ignore next */
        default:
          const exhaustiveCheck: never = operation
          const neverClient: SecureClient = {} as SecureClient
          return neverClient
      }
    }
    case 'db': {
      const data = JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: operation.params
      })
      return {
        kind: 'secure',
        client: fetch(`https://${clientOptions.host}${operation.path}`, {
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Content-Length': data.length.toString()
          }
        })
      }
    }
    case 'model': {
      const data = JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: operation.params
      })
      return {
        kind: 'secure',
        client: fetch(`https://${clientOptions.host}${operation.path}`, {
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Content-Length': data.length.toString(),
            Cookie: `session_id=${operation.sessionToken}`
          }
        })
      }
    }
    /* istanbul ignore next */
    default:
      const exhaustiveCheck: never = operation
      const neverClient: SecureClient = {} as SecureClient
      return neverClient
  }
}

/* istanbul ignore next */
export const createInsecureClient = ({
  clientOptions,
  operation
}: CreateInsecureClientParams): InsecureClient => {
  switch (operation.serviceType) {
    case 'common': {
      switch (operation.path) {
        case '/web/webclient/version_info': {
          const data = JSON.stringify({
            jsonrpc: '2.0',
            method: 'call',
            params: {}
          })
          return {
            kind: 'insecure',
            client: fetch(`http://${clientOptions.host}:${clientOptions.port}${operation.path}`, {
              method: 'POST',
              body: data,
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Content-Length': data.length.toString()
              }
            })
          }
        }
        case '/web/session/authenticate': {
          const data = JSON.stringify({
            jsonrpc: '2.0',
            method: 'call',
            params: operation.params
          })
          return {
            kind: 'insecure',
            client: fetch(`http://${clientOptions.host}:${clientOptions.port}${operation.path}`, {
              method: 'POST',
              body: data,
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Content-Length': data.length.toString()
              }
            })
          }
        }
        default:
          const exhaustiveCheck: never = operation
          const neverClient: InsecureClient = {} as InsecureClient
          return neverClient
      }
    }
    case 'db': {
      const data = JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: operation.params
      })
      return {
        kind: 'insecure',
        client: fetch(`http://${clientOptions.host}:${clientOptions.port}${operation.path}`, {
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Content-Length': data.length.toString()
          }
        })
      }
    }
    case 'model': {
      const data = JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: operation.params
      })
      return {
        kind: 'insecure',
        client: fetch(`http://${clientOptions.host}:${clientOptions.port}${operation.path}`, {
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Content-Length': data.length.toString(),
            Cookie: `session_id=${operation.sessionToken}`
          }
        })
      }
    }
    default:
      const exhaustiveCheck: never = operation
      const neverClient: InsecureClient = {} as InsecureClient
      return neverClient
  }
}

/* istanbul ignore next */
const createClient = ({ clientOptions, operation }: CreateClientParams): Client => {
  switch (clientOptions.kind) {
    case 'insecure': {
      return createInsecureClient({
        clientOptions,
        operation
      })
    }
    case 'secure': {
      return createSecureClient({
        clientOptions,
        operation
      })
    }
    /* istanbul ignore next */
    default:
      const exhaustiveCheck: never = clientOptions
      const neverClient: Client = {} as Client
      return neverClient
  }
}

// End of client

// Start of Service error
type UserErrorException = 'user_error'
type WarningException = 'warning'
type AccessErrorException = 'access_error'
type MissingErrorException = 'missing_error'
type AccessDeniedException = 'access_denied'
type ValidationErrorException = 'validation_error'
type ExceptORMException = 'except_orm'
type AuthenticationException = 'authentication_error'

const UserErrorException: UserErrorException = 'user_error'
const WarningException: WarningException = 'warning'
const AccessErrorException: AccessErrorException = 'access_error'
const MissingErrorException: MissingErrorException = 'missing_error'
const AccessDeniedException: AccessDeniedException = 'access_denied'
const ValidationErrorException: ValidationErrorException = 'validation_error'
const ExceptORMException: ExceptORMException = 'except_orm'
const AuthenticationException: AuthenticationException = 'authentication_error'

type OdooStatusCode = 100 | 200

type OdooExceptionType =
  | UserErrorException
  | WarningException
  | AccessErrorException
  | MissingErrorException
  | AccessDeniedException
  | ValidationErrorException
  | ExceptORMException
  | AuthenticationException

export interface OdooJSONRPCError {
  code: OdooStatusCode
  message: string
  data: {
    message: string
    exception_type: OdooExceptionType
    debug: string
    name: string
    arguments: Array<string>
  }
}

interface BaseServiceError {
  debug: string
  message: string
}

interface UserError extends BaseServiceError {
  kind: 'userError'
}

interface Warning extends BaseServiceError {
  kind: 'warning'
}

interface AccessError extends BaseServiceError {
  kind: 'accessError'
}

interface MissingError extends BaseServiceError {
  kind: 'missingError'
}

interface AccessDenied extends BaseServiceError {
  kind: 'accessDenied'
}

interface ValidationError extends BaseServiceError {
  kind: 'validationError'
}

interface ExceptORM extends BaseServiceError {
  kind: 'exceptORM'
}

interface AuthenticationError extends BaseServiceError {
  kind: 'authenticationError'
}

export type ServiceOperationError =
  | UserError
  | Warning
  | AccessError
  | MissingError
  | AccessDenied
  | ValidationError
  | ExceptORM
  | AuthenticationError

type CreateServiceOperationErrorParams = {
  error: OdooJSONRPCError
}

export const statusCodeToExceptionType = (
  statusCode: OdooStatusCode,
  exceptionType: OdooExceptionType
): OdooExceptionType => {
  switch (statusCode) {
    case 100: {
      return 'authentication_error'
    }
    case 200: {
      return exceptionType
    }
    /* istanbul ignore next */
    default:
      const exhaustiveCheck: never = statusCode
      return exceptionType
  }
}

export const addExceptionTypeToOdooJSONRPCError = ({
  code,
  data,
  ...rest
}: OdooJSONRPCError): OdooJSONRPCError => ({
  ...rest,
  code,
  data: {
    ...data,
    exception_type: statusCodeToExceptionType(code, data.exception_type)
  }
})

export const createServiceOperationError = ({
  error
}: CreateServiceOperationErrorParams): ServiceOperationError => {
  const errorInformation = {
    debug: error.data.debug,
    message: error.data.message
  }
  switch (error.data.exception_type) {
    case UserErrorException:
      return {
        kind: 'userError',
        ...errorInformation
      }
    case WarningException:
      return {
        kind: 'warning',
        ...errorInformation
      }
    case AccessErrorException:
      return {
        kind: 'accessError',
        ...errorInformation
      }
    case MissingErrorException:
      return {
        kind: 'missingError',
        ...errorInformation
      }
    case AccessDeniedException:
      return {
        kind: 'accessDenied',
        ...errorInformation
      }
    case ValidationErrorException:
      return {
        kind: 'validationError',
        ...errorInformation
      }
    case ExceptORMException:
      return {
        kind: 'exceptORM',
        ...errorInformation
      }
    case AuthenticationException:
      return {
        kind: 'authenticationError',
        ...errorInformation
      }
    /* istanbul ignore next */
    default:
      const exhaustiveCheck: never = error.data.exception_type
      const neverOperationError: ServiceOperationError = {} as ServiceOperationError
      return neverOperationError
  }
}

// End of service error

// Start of service

type Service = CommonService | DBService | ModelService

interface BaseService {
  client: Client
}

interface CommonService extends BaseService {
  kind: CommonServiceOperation['serviceType']
  operation: CommonServiceOperation
}

interface DBService extends BaseService {
  kind: DBServiceOperation['serviceType']
  operation: DBServiceOperation
}

interface ModelService extends BaseService {
  kind: ModelServiceOperation['serviceType']
  credentials: ModelServiceCredentials
  operation: ModelServiceOperation
}

type CreateServiceParams = {
  operation: ServiceOperation
  clientOptions: ClientOptions
}

export const createService = ({
  operation,
  clientOptions
}: CreateServiceParams): Stream<Either<ServiceOperationError, ServiceOperationResult>> => {
  const client = createClient({ clientOptions, operation })
  return xs
    .fromPromise(client.client)
    .map(result => {
      return xs.fromPromise(result.json())
    })
    .flatten()
    .map(result => {
      /* istanbul ignore next */
      if (result.result) {
        /* tslint:disable:no-unnecessary-type-assertion */

        return right(result.result) as Either<ServiceOperationError, ServiceOperationResult>
        /* istanbul ignore next */
      } else if (result.error) {
        /* tslint:disable:no-unnecessary-type-assertion */
        return left(
          createServiceOperationError({
            error: addExceptionTypeToOdooJSONRPCError(result.error)
          })
        ) as Either<ServiceOperationError, ServiceOperationResult>
      }
      /* istanbul ignore next */
      return right(result.result) as Either<ServiceOperationError, ServiceOperationResult>
    })
    .map(result => {
      return result
    })
}

interface AuthenticateCredentials {
  db: string
  username: string
  password: string
  dummy: {}
}

interface ModelServiceCredentials {
  db: string
  uid: number
  password: string
}

// End of service

type CreateAuthenticateCredentialsParams = {
  db: string
  username: string
  password: string
}

export const createAuthenticateCredentials = ({
  db,
  username,
  password
}: CreateAuthenticateCredentialsParams): AuthenticateCredentials => {
  const authenticateCredentials: AuthenticateCredentials = {
    db,
    username,
    password,
    dummy: {}
  }

  return authenticateCredentials
}

interface BaseCommonServiceOperation {
  serviceType: 'common'
}

interface BaseModelServiceOperation {
  serviceType: 'model'
  path: '/web/dataset/call_kw'
  sessionToken: string
}

interface BaseDBServiceOperation {
  serviceType: 'db'
  path: '/jsonrpc'
}

interface Authenticate extends BaseCommonServiceOperation {
  kind: 'authenticate'
  params: {
    db: string
    login: string
    password: string
  }
  path: '/web/session/authenticate'
}

interface GetVersion extends BaseCommonServiceOperation {
  kind: 'getVersion'
  path: '/web/webclient/version_info'
}

interface Create extends BaseModelServiceOperation {
  kind: 'create'

  params: {
    model: string
    method: 'create'
    args: Array<any>
    kwargs: any
  }
}

interface Delete extends BaseModelServiceOperation {
  kind: 'delete'

  params: {
    model: string
    method: 'unlink'
    args: Array<any>
    kwargs: any
  }
}

interface Read extends BaseModelServiceOperation {
  kind: 'read'

  params: {
    model: string
    method: 'read'
    args: Array<any>
    kwargs: any
  }
}

interface Search extends BaseModelServiceOperation {
  kind: 'search'

  params: {
    model: string
    method: 'search'
    args: Array<any>
    kwargs: any
  }
}

interface SearchCount extends BaseModelServiceOperation {
  kind: 'searchCount'

  params: {
    model: string
    method: 'search_count'
    args: Array<any>
    kwargs: any
  }
}

interface SearchRead
  extends Pick<BaseModelServiceOperation, Exclude<keyof BaseModelServiceOperation, 'path'>> {
  kind: 'searchRead'
  params: {
    model: string
    domain: Array<any>
    fields?: Array<string>
    offset?: number
    limit: number | boolean
    sort?: string
    context?: any
  }
  path: '/web/dataset/search_read'
}

interface Update extends BaseModelServiceOperation {
  kind: 'update'
  params: {
    model: string
    method: 'write'
    args: Array<any>
    kwargs: any
  }
}

interface NameSearch extends BaseModelServiceOperation {
  kind: 'nameSearch'
  params: {
    model: string
    method: 'name_search'
    args: Array<any>
    kwargs: any
  }
}

interface DefaultGet extends BaseModelServiceOperation {
  kind: 'defaultGet'
  params: {
    model: string
    method: 'default_get'
    args: Array<any>
    kwargs: any
  }
}

interface FieldsGet extends BaseModelServiceOperation {
  kind: 'fieldsGet'
  params: {
    model: string
    method: 'fields_get'
    args: Array<any>
    kwargs: any
  }
}

interface NameGet extends BaseModelServiceOperation {
  kind: 'nameGet'
  params: {
    model: string
    method: 'name_get'
    args: Array<any>
    kwargs: any
  }
}

interface OnChange extends BaseModelServiceOperation {
  kind: 'onChange'
  params: {
    model: string
    method: 'onchange'
    args: Array<any>
    kwargs: any
  }
}

interface CallMethod extends BaseModelServiceOperation {
  kind: 'callMethod'
  params: {
    model: string
    method: string
    args: Array<any>
    kwargs: any
  }
}

interface DBExist extends BaseDBServiceOperation {
  kind: 'dbExist'
  params: {
    service: 'db'
    method: 'db_exist'
    args: Array<any>
  }
}

interface ListDB extends BaseDBServiceOperation {
  kind: 'dbList'
  params: {
    service: 'db'
    method: 'list'
    args: []
  }
}

interface CreateDB extends BaseDBServiceOperation {
  kind: 'dbCreateDatabase'
  params: {
    service: 'db'
    method: 'create_database'
    args: Array<any>
  }
}

export type ServiceOperationResult = any

export type ServiceOperation = CommonServiceOperation | ModelServiceOperation | DBServiceOperation

type CommonServiceOperation = Authenticate | GetVersion
type ModelServiceOperation =
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

type DBServiceOperation = DBExist | ListDB | CreateDB

interface CreateAuthenticateParams {
  credentials: AuthenticateCredentials
}

export const createAuthenticate = ({ credentials }: CreateAuthenticateParams): Authenticate => {
  const authenticate: Authenticate = {
    kind: 'authenticate',
    serviceType: 'common',
    params: {
      db: credentials.db,
      login: credentials.username,
      password: credentials.password
    },
    path: '/web/session/authenticate'
  }

  return authenticate
}

export const createGetVersion = (): GetVersion => {
  const getVersion: GetVersion = {
    kind: 'getVersion',
    serviceType: 'common',
    path: '/web/webclient/version_info'
  }

  return getVersion
}

interface BaseModelServiceOperationParams {
  modelName: string
  sessionToken: string
  kwargs?: object
}

interface CreateCreateParams extends BaseModelServiceOperationParams {
  fieldsValues: any
}

export const createCreate = ({
  modelName,
  fieldsValues,
  sessionToken,
  /* istanbul ignore next */
  kwargs = {}
}: CreateCreateParams): Create => {
  const create: Create = {
    kind: 'create',
    serviceType: 'model',
    path: '/web/dataset/call_kw',
    params: {
      args: [fieldsValues],
      kwargs: kwargs,
      method: 'create',
      model: modelName
    },
    sessionToken
  }

  return create
}

interface CreateDeleteParams extends BaseModelServiceOperationParams {
  ids: Array<number>
}

export const createDelete = ({
  modelName,
  ids,
  sessionToken,
  /* istanbul ignore next */
  kwargs = {}
}: CreateDeleteParams): Delete => {
  const unlink: Delete = {
    kind: 'delete',
    serviceType: 'model',
    path: '/web/dataset/call_kw',
    params: {
      args: [ids],
      kwargs: kwargs,
      method: 'unlink',
      model: modelName
    },
    sessionToken
  }

  return unlink
}

interface CreateSearchParams extends BaseModelServiceOperationParams {
  domain: Array<any>
  offset?: number
  limit?: number | boolean
  order?: string
  count?: boolean
}

// TODO: Add test for createSearch
export const createSearch = ({
  /* istanbul ignore next */
  modelName,
  /* istanbul ignore next */
  domain,
  /* istanbul ignore next */
  offset = 0,
  /* istanbul ignore next */
  limit = false,
  /* istanbul ignore next */
  order,
  /* istanbul ignore next */
  count = false,
  /* istanbul ignore next */
  sessionToken,
  /* istanbul ignore next */
  kwargs = {}
}: CreateSearchParams): Search => {
  /* istanbul ignore next */
  const search: Search = {
    kind: 'search',
    serviceType: 'model',
    params: {
      args: [domain, offset, limit, order, count],
      kwargs: kwargs,
      method: 'search',
      model: modelName
    },
    sessionToken,
    path: '/web/dataset/call_kw'
  }

  /* istanbul ignore next */
  return search
}

interface CreateSearchCountParams extends BaseModelServiceOperationParams {
  searchDomain: Array<any>
}

export const createSearchCount = ({
  modelName,
  searchDomain,
  sessionToken,
  /* istanbul ignore next */
  kwargs = {}
}: CreateSearchCountParams): SearchCount => {
  const searchCount: SearchCount = {
    kind: 'searchCount',
    serviceType: 'model',
    params: {
      args: [searchDomain],
      kwargs: kwargs,
      method: 'search_count',
      model: modelName
    },
    path: '/web/dataset/call_kw',
    sessionToken
  }

  return searchCount
}

interface CreateReadParams extends BaseModelServiceOperationParams {
  modelName: string
  ids: Array<number>
  fields?: Array<string>
}

export const createRead = ({
  modelName,
  ids,
  fields = [],
  sessionToken,
  /* istanbul ignore next */
  kwargs = {}
}: CreateReadParams): Read => {
  const read: Read = {
    kind: 'read',
    serviceType: 'model',
    params: {
      args: [ids, fields],
      kwargs: kwargs,
      method: 'read',
      model: modelName
    },
    path: '/web/dataset/call_kw',
    sessionToken
  }

  return read
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface CreateSearchReadParams extends BaseModelServiceOperationParams {
  domain: Array<any>
  fields?: Array<string>
  limit?: number | boolean
  offset?: number
  sort?: string
  context?: any
}

export const createSearchRead = ({
  modelName,
  domain,
  /* istanbul ignore next */
  fields = [],
  /* istanbul ignore next */
  limit = false,
  /* istanbul ignore next */
  offset = 0,
  /* istanbul ignore next */
  sort = '',
  sessionToken,
  /* istanbul ignore next */
  context = {}
}: Omit<CreateSearchReadParams, 'kwargs'>): SearchRead => {
  const searchRead: SearchRead = {
    kind: 'searchRead',
    serviceType: 'model',
    params: {
      model: modelName,
      fields,
      offset,
      limit,
      domain,
      sort,
      context
    },
    path: '/web/dataset/search_read',
    sessionToken
  }

  return searchRead
}

interface CreateNameSearchParams extends BaseModelServiceOperationParams {
  nameToSearch: string
  limit?: number
  operator?: string
  searchDomain?: Array<any>
}

export const createNameSearch = ({
  modelName,
  nameToSearch,
  /* istanbul ignore next */
  limit = 100,
  /* istanbul ignore next */
  operator = 'ilike',
  /* istanbul ignore next */
  searchDomain = [],
  sessionToken,
  /* istanbul ignore next */
  kwargs = {}
}: CreateNameSearchParams): NameSearch => {
  const nameSearch: NameSearch = {
    kind: 'nameSearch',
    serviceType: 'model',
    params: {
      args: [nameToSearch, searchDomain, operator, limit],
      kwargs: kwargs,
      method: 'name_search',
      model: modelName
    },
    path: '/web/dataset/call_kw',
    sessionToken
  }

  return nameSearch
}

interface CreateUpdateParams extends BaseModelServiceOperationParams {
  fieldsValues: any
  ids: Array<number>
}

export const createUpdate = ({
  modelName,
  ids,
  fieldsValues,
  sessionToken,
  /* istanbul ignore next */
  kwargs = {}
}: CreateUpdateParams): Update => {
  const update: Update = {
    kind: 'update',
    serviceType: 'model',
    params: {
      args: [ids, fieldsValues],
      kwargs: kwargs,
      method: 'write',
      model: modelName
    },
    path: '/web/dataset/call_kw',
    sessionToken
  }

  return update
}

interface CreateDefaultGetParams extends BaseModelServiceOperationParams {
  fieldsNames: Array<string>
}

export const createDefaultGet = ({
  modelName,
  fieldsNames,
  sessionToken,
  /* istanbul ignore next */
  kwargs = {}
}: CreateDefaultGetParams): DefaultGet => {
  const defaultGet: DefaultGet = {
    kind: 'defaultGet',
    serviceType: 'model',
    params: {
      args: [fieldsNames],
      kwargs: kwargs,
      method: 'default_get',
      model: modelName
    },
    path: '/web/dataset/call_kw',
    sessionToken
  }

  return defaultGet
}

interface CreateFieldsGetParams extends BaseModelServiceOperationParams {
  fieldsNames?: Array<string>
  attributes?: Array<string>
}

export const createFieldsGet = ({
  modelName,
  fieldsNames = [],
  /* istanbul ignore next */
  attributes = [],
  sessionToken,
  /* istanbul ignore next */
  kwargs = {}
}: CreateFieldsGetParams): FieldsGet => {
  const fieldsGet: FieldsGet = {
    kind: 'fieldsGet',
    serviceType: 'model',
    params: {
      args: [fieldsNames, attributes],
      kwargs: kwargs,
      method: 'fields_get',
      model: modelName
    },
    path: '/web/dataset/call_kw',
    sessionToken
  }

  return fieldsGet
}

interface CreateNameGetParams extends BaseModelServiceOperationParams {
  modelName: string
  ids: Array<number>
}

export const createNameGet = ({
  modelName,
  ids,
  sessionToken,
  /* istanbul ignore next */
  kwargs = {}
}: CreateNameGetParams): NameGet => {
  const nameGet: NameGet = {
    kind: 'nameGet',
    serviceType: 'model',
    params: {
      args: [ids],
      kwargs: kwargs,
      method: 'name_get',
      model: modelName
    },
    path: '/web/dataset/call_kw',
    sessionToken
  }

  return nameGet
}

interface CreateOnChangeParams extends BaseModelServiceOperationParams {
  modelName: string
  values: any
  fieldName: Array<string>
  fieldOnChange: any
}

export const createOnChange = ({
  modelName,
  values,
  fieldName,
  fieldOnChange,
  sessionToken,
  /* istanbul ignore next */
  kwargs = {}
}: CreateOnChangeParams): OnChange => {
  const onChange: OnChange = {
    kind: 'onChange',
    serviceType: 'model',
    params: {
      args: [[], values, fieldName, fieldOnChange],
      kwargs: kwargs,
      method: 'onchange',
      model: modelName
    },
    path: '/web/dataset/call_kw',
    sessionToken
  }

  return onChange
}

interface CreateCallMethodParams extends BaseModelServiceOperationParams {
  modelName: string
  methodName: string
  args: Array<any>
}

export const createCallMethod = ({
  modelName,
  methodName,
  args,
  /* istanbul ignore next */
  kwargs = {},
  sessionToken
}: CreateCallMethodParams): CallMethod => {
  const callMethod: CallMethod = {
    kind: 'callMethod',
    serviceType: 'model',
    params: {
      args,
      kwargs: kwargs,
      method: methodName,
      model: modelName
    },
    path: '/web/dataset/call_kw',
    sessionToken
  }

  return callMethod
}

type CreateDBExistParams = {
  dbName: string
}

export const createDBExist = ({ dbName }: CreateDBExistParams): DBExist => {
  const dbExist: DBExist = {
    kind: 'dbExist',
    serviceType: 'db',
    params: {
      args: [dbName],
      method: 'db_exist',
      service: 'db'
    },
    path: '/jsonrpc'
  }

  return dbExist
}

export const createListDB = (): ListDB => {
  const listDB: ListDB = {
    kind: 'dbList',
    serviceType: 'db',
    params: {
      args: [],
      method: 'list',
      service: 'db'
    },
    path: '/jsonrpc'
  }

  return listDB
}

type CreateCreateDBParams = {
  adminPassword: string
  dbName: string
  demo: boolean
  lang: string
  userPassword: string
  login: string
  countryCode: string
}

export const createDB = ({
  adminPassword,
  dbName,
  demo,
  lang,
  userPassword,
  login,
  countryCode
}: CreateCreateDBParams): CreateDB => {
  const createDB: CreateDB = {
    kind: 'dbCreateDatabase',
    serviceType: 'db',
    params: {
      args: [adminPassword, dbName, demo, lang, userPassword, login, countryCode],
      method: 'create_database',
      service: 'db'
    },
    path: '/jsonrpc'
  }

  return createDB
}
