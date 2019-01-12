import { Either, left, right } from 'fp-ts/lib/Either'
const xmlrpc = require('xmlrpc')

import 'core-js/fn/object/values'

// Start of client
type Client = SecureClient | InsecureClient

interface XMLRPCClient {
  methodCall: any
}

interface BaseClient {
  client: XMLRPCClient
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

export const createSecureClient = ({
  clientOptions,
  operation
}: CreateClientParams): SecureClient => {
  switch (operation.serviceType) {
    case 'common': {
      const client: XMLRPCClient = xmlrpc.createSecureClient({
        ...clientOptions,
        path: '/xmlrpc/2/common'
      })

      const secureClient: SecureClient = {
        kind: 'secure',
        client
      }

      return secureClient
    }
    case 'db': {
      const client: XMLRPCClient = xmlrpc.createSecureClient({
        ...clientOptions,
        path: '/xmlrpc/2/db'
      })

      const secureClient: SecureClient = {
        kind: 'secure',
        client
      }

      return secureClient
    }
    case 'model': {
      const client: XMLRPCClient = xmlrpc.createSecureClient({
        ...clientOptions,
        path: '/xmlrpc/2/object'
      })

      const secureClient: SecureClient = {
        kind: 'secure',
        client
      }

      return secureClient
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
}: CreateClientParams): InsecureClient => {
  switch (operation.serviceType) {
    case 'common': {
      const client: XMLRPCClient = xmlrpc.createClient({
        ...clientOptions,
        path: '/xmlrpc/2/common'
      })

      const insecureClient: InsecureClient = {
        kind: 'insecure',
        client
      }

      return insecureClient
    }
    case 'db': {
      const client: XMLRPCClient = xmlrpc.createClient({
        ...clientOptions,
        path: '/xmlrpc/2/common'
      })

      const insecureClient: InsecureClient = {
        kind: 'insecure',
        client
      }

      return insecureClient
    }
    case 'model': {
      const client: XMLRPCClient = xmlrpc.createClient({
        ...clientOptions,
        path: '/xmlrpc/2/common'
      })

      const insecureClient: InsecureClient = {
        kind: 'insecure',
        client
      }

      return insecureClient
    }
    /* istanbul ignore next */
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
type RPC_FAULT_CODE_CLIENT_ERROR = 1 // indistinguishable from app. error.
type RPC_FAULT_CODE_APPLICATION_ERROR = 1
type RPC_FAULT_CODE_WARNING = 2
type RPC_FAULT_CODE_ACCESS_DENIED = 3
type RPC_FAULT_CODE_ACCESS_ERROR = 4

const RPC_FAULT_CODE_CLIENT_ERROR: RPC_FAULT_CODE_CLIENT_ERROR = 1
const RPC_FAULT_CODE_APPLICATION_ERROR: RPC_FAULT_CODE_APPLICATION_ERROR = 1
const RPC_FAULT_CODE_WARNING: RPC_FAULT_CODE_WARNING = 2
const RPC_FAULT_CODE_ACCESS_DENIED: RPC_FAULT_CODE_ACCESS_DENIED = 3
const RPC_FAULT_CODE_ACCESS_ERROR: RPC_FAULT_CODE_ACCESS_ERROR = 4

export interface XMLRPCClientError {
  body: any
  faultCode:
    | RPC_FAULT_CODE_CLIENT_ERROR
    | RPC_FAULT_CODE_APPLICATION_ERROR
    | RPC_FAULT_CODE_WARNING
    | RPC_FAULT_CODE_ACCESS_DENIED
    | RPC_FAULT_CODE_ACCESS_ERROR
  faultString: string
  req: any
  res: any
}

interface BaseServiceError {
  message: string
}

interface ApplicationError extends BaseServiceError {
  kind: 'application'
}

interface Warning extends BaseServiceError {
  kind: 'warning'
}

interface AccessDenied extends BaseServiceError {
  kind: 'accessDenied'
}

interface AccessError extends BaseServiceError {
  kind: 'accessError'
}

interface UnknownError extends BaseServiceError {
  kind: 'unknownError'
}

export type ServiceOperationError =
  | ApplicationError
  | Warning
  | AccessDenied
  | AccessError
  | UnknownError // Odoo is not going to emit this error but just in case.

type CreateServiceOperationErrorParams = {
  error: XMLRPCClientError
}

export const createServiceOperationError = ({
  error
}: CreateServiceOperationErrorParams): ServiceOperationError => {
  switch (error.faultCode) {
    case RPC_FAULT_CODE_APPLICATION_ERROR:
      return {
        kind: 'application',
        message: error.faultString
      }
    case RPC_FAULT_CODE_WARNING:
      return {
        kind: 'warning',
        message: error.faultString
      }
    case RPC_FAULT_CODE_ACCESS_DENIED:
      return {
        kind: 'accessDenied',
        message: error.faultString
      }
    case RPC_FAULT_CODE_ACCESS_ERROR:
      return {
        kind: 'accessError',
        message: error.faultString
      }
    /* istanbul ignore next */
    default:
      const exhaustiveCheck: never = error.faultCode
      return {
        kind: 'unknownError',
        message:
          'An unknown error occured! Odoo might have introduced a new kind of error, please kindly check there.'
      }
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

type CreateModelServiceParams = {
  credentials: ModelServiceCredentials
  operation: ModelServiceOperation
  clientOptions: ClientOptions
  mockMethodCall?: (
    firstArg: any,
    secondArg: any,
    callback: (err: string, result: any) => void
  ) => {}
}

export const createModelService = ({
  credentials,
  operation,
  clientOptions,
  mockMethodCall
}: CreateModelServiceParams): ModelService => {
  const client = createClient({ clientOptions, operation })

  /* istanbul ignore next */
  if (mockMethodCall) {
    client.client.methodCall = mockMethodCall
  }

  return {
    kind: 'model',
    credentials,
    client,
    operation
  }
}

type CreateCommonServiceParams = {
  operation: CommonServiceOperation
  clientOptions: ClientOptions
  mockMethodCall?: (
    firstArg: any,
    secondArg: any,
    callback: (err: string, result: any) => void
  ) => {}
}

export const createCommonService = ({
  operation,
  clientOptions,
  mockMethodCall
}: CreateCommonServiceParams): CommonService => {
  const client = createClient({ clientOptions, operation })

  /* istanbul ignore next */
  if (mockMethodCall) {
    client.client.methodCall = mockMethodCall
  }

  return {
    kind: 'common',
    client,
    operation
  }
}

type CreateDBServiceParams = {
  operation: DBServiceOperation
  clientOptions: ClientOptions
  mockMethodCall?: (
    firstArg: any,
    secondArg: any,
    callback: (err: string, result: any) => void
  ) => {}
}

export const createDBService = ({
  operation,
  clientOptions,
  mockMethodCall
}: CreateDBServiceParams): DBService => {
  const client = createClient({ clientOptions, operation })

  /* istanbul ignore next */
  if (mockMethodCall) {
    client.client.methodCall = mockMethodCall
  }

  return {
    kind: 'db',
    client,
    operation
  }
}

type ExecuteModelServiceParams = {
  service: ModelService
  // callback: (result: Either<ServiceOperationError, ServiceOperationResult>) => any
  callback: any
}

// Ignore test because this is used only inside the executeService which is tested
/* istanbul ignore next */
const executeModelService = ({ service, callback }: ExecuteModelServiceParams): void => {
  switch (service.operation.kind) {
    case 'create': {
      service.client.client.methodCall(
        'execute_kw',
        Object.values(service.credentials).concat(service.operation.modelName, 'create', [
          [service.operation.fieldsValues]
        ]),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(createServiceOperationError({ error })))
          } else {
            callback(right(value))
          }
        }
      )
      return
    }
    case 'delete': {
      service.client.client.methodCall(
        'execute_kw',
        Object.values(service.credentials).concat(service.operation.modelName, 'unlink', [
          service.operation.ids
        ]),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(createServiceOperationError({ error })))
          } else {
            callback(right(value))
          }
        }
      )
      return
    }
    case 'search': {
      service.client.client.methodCall(
        'execute_kw',
        Object.values(service.credentials).concat(
          service.operation.modelName,
          'search',
          [[service.operation.domain]],
          service.operation.optionalParameters
        ),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(createServiceOperationError({ error })))
          } else {
            callback(right(value))
          }
        }
      )
      return
    }
    case 'searchCount': {
      service.client.client.methodCall(
        'execute_kw',
        Object.values(service.credentials).concat(service.operation.modelName, 'search_count', [
          [service.operation.domain]
        ]),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(createServiceOperationError({ error })))
          } else {
            callback(right(value))
          }
        }
      )
      return
    }
    case 'searchRead': {
      service.client.client.methodCall(
        'execute_kw',
        Object.values(service.credentials).concat(
          service.operation.modelName,
          'search_read',
          [[service.operation.domain]],
          service.operation.optionalParameters
        ),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(createServiceOperationError({ error })))
          } else {
            callback(right(value))
          }
        }
      )
      return
    }
    case 'nameSearch': {
      service.client.client.methodCall(
        'execute_kw',
        Object.values(service.credentials).concat(
          service.operation.modelName,
          'name_search',
          [[service.operation.nameToSearch]],
          service.operation.optionalParameters
        ),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(createServiceOperationError({ error })))
          } else {
            callback(right(value))
          }
        }
      )
      return
    }
    case 'read': {
      service.client.client.methodCall(
        'execute_kw',
        Object.values(service.credentials).concat(
          service.operation.modelName,
          'read',
          [service.operation.ids],
          service.operation.fields
        ),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(createServiceOperationError({ error })))
          } else {
            callback(right(value))
          }
        }
      )
      return
    }
    case 'update': {
      service.client.client.methodCall(
        'execute_kw',
        Object.values(service.credentials).concat(service.operation.modelName, 'write', [
          [service.operation.ids].concat(service.operation.fieldsValues)
        ]),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(createServiceOperationError({ error })))
          } else {
            callback(right(value))
          }
        }
      )
      return
    }
    case 'defaultGet': {
      service.client.client.methodCall(
        'execute_kw',
        Object.values(service.credentials).concat(service.operation.modelName, 'default_get', [
          [service.operation.fieldsNames]
        ]),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(createServiceOperationError({ error })))
          } else {
            callback(right(value))
          }
        }
      )
      return
    }
    case 'fieldsGet': {
      service.client.client.methodCall(
        'execute_kw',
        Object.values(service.credentials).concat(service.operation.modelName, 'fields_get', [
          [service.operation.fieldsNames].concat(service.operation.attributes)
        ]),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(createServiceOperationError({ error })))
          } else {
            callback(right(value))
          }
        }
      )
      return
    }
    case 'nameGet': {
      service.client.client.methodCall(
        'execute_kw',
        Object.values(service.credentials).concat(service.operation.modelName, 'name_get', [
          [service.operation.ids]
        ]),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(createServiceOperationError({ error })))
          } else {
            callback(right(value))
          }
        }
      )
      return
    }
    case 'onChange': {
      service.client.client.methodCall(
        'execute_kw',
        Object.values(service.credentials).concat(service.operation.modelName, 'onchange', [
          [
            [],
            service.operation.values,
            service.operation.fieldName,
            service.operation.fieldOnChange
          ]
        ]),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(createServiceOperationError({ error })))
          } else {
            callback(right(value))
          }
        }
      )
      return
    }
    case 'callMethod': {
      service.client.client.methodCall(
        'execute_kw',
        Object.values(service.credentials).concat(
          service.operation.modelName,
          service.operation.methodName,
          service.operation.args,
          service.operation.kwargs
        ),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(createServiceOperationError({ error })))
          } else {
            callback(right(value))
          }
        }
      )
      return
    }
    /* istanbul ignore next */
    default:
      const exhaustiveCheck: never = service.operation
  }
  return
}

type ExecuteCommonServiceParams = {
  service: CommonService
  // callback: (result: Either<ServiceOperationError, ServiceOperationResult>) => any
  callback: any
}

// Ignore test because this is used only inside the executeService which is tested
/* istanbul ignore next */
const executeCommonService = ({ service, callback }: ExecuteCommonServiceParams): void => {
  switch (service.operation.kind) {
    case 'authenticate': {
      service.client.client.methodCall(
        'authenticate',
        Object.values(service.operation.credentials),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(createServiceOperationError({ error })))
          } else {
            callback(right(value))
          }
        }
      )
      return
    }
    case 'getVersion': {
      service.client.client.methodCall('version', [], (error: XMLRPCClientError, value: any) => {
        if (error) {
          callback(left(createServiceOperationError({ error })))
        } else {
          callback(right(value))
        }
      })
      return
    }
    /* istanbul ignore next */
    default:
      const exhaustiveCheck: never = service.operation
  }
  return
}

type ExecuteDBServiceParams = {
  service: DBService
  // callback: (result: Either<ServiceOperationError, ServiceOperationResult>) => any
  callback: any
}

// Ignore test because this is used only inside the executeService which is tested
/* istanbul ignore next */
const executeDBService = ({ service, callback }: ExecuteDBServiceParams): void => {
  switch (service.operation.kind) {
    case 'dbExist': {
      service.client.client.methodCall(
        'db_exist',
        [service.operation.dbName],
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(createServiceOperationError({ error })))
          } else {
            callback(right(value))
          }
        }
      )
      return
    }
    case 'listDB':
      service.client.client.methodCall('list', [], (error: XMLRPCClientError, value: any) => {
        if (error) {
          callback(left(createServiceOperationError({ error })))
        } else {
          callback(right(value))
        }
      })
      return
    case 'createDB':
      service.client.client.methodCall(
        'create_database',
        [
          service.operation.adminPassword,
          service.operation.dbName,
          service.operation.demo,
          service.operation.lang,
          service.operation.userPassword,
          service.operation.login,
          service.operation.countryCode
        ],
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(createServiceOperationError({ error })))
          } else {
            callback(right(value))
          }
        }
      )
      return
    /* istanbul ignore next */
    default:
      const exhaustiveCheck: never = service.operation
  }
  return
}

type ExecuteServiceParams = {
  service: Service
  // callback: (result: Either<ServiceOperationError, ServiceOperationResult>) => any
  callback: any
}

export const executeService = ({ service, callback }: ExecuteServiceParams): void => {
  switch (service.kind) {
    case 'common': {
      executeCommonService({ service, callback })
      return
    }
    case 'db': {
      executeDBService({ service, callback })
      return
    }
    case 'model': {
      executeModelService({ service, callback })
      return
    }
    /* istanbul ignore next */
    default:
      const exhaustiveCheck: never = service
  }
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

type CreateModelServiceCredentialsParams = {
  db: string
  uid: number
  password: string
}

export const createModelServiceCredentials = ({
  db,
  uid,
  password
}: CreateModelServiceCredentialsParams): ModelServiceCredentials => {
  const modelServiceCredentials: ModelServiceCredentials = {
    db,
    uid,
    password
  }

  return modelServiceCredentials
}

interface BaseCommonServiceOperation {
  serviceType: 'common'
}

interface BaseModelServiceOperation {
  serviceType: 'model'
}

interface BaseDBServiceOperation {
  serviceType: 'db'
}

interface Authenticate extends BaseCommonServiceOperation {
  kind: 'authenticate'
  credentials: AuthenticateCredentials
}

interface GetVersion extends BaseCommonServiceOperation {
  kind: 'getVersion'
}

interface Create extends BaseModelServiceOperation {
  kind: 'create'
  modelName: string
  fieldsValues: any
}

interface Delete extends BaseModelServiceOperation {
  kind: 'delete'
  ids: Array<Array<number>>
  modelName: string
}

interface Read extends BaseModelServiceOperation {
  kind: 'read'
  fields?: any
  ids: Array<Array<number>>
  modelName: string
}

interface Search extends BaseModelServiceOperation {
  kind: 'search'
  domain: any
  modelName: string
  optionalParameters?: any
}

interface SearchCount extends BaseModelServiceOperation {
  kind: 'searchCount'
  domain: any
  modelName: string
}

interface SearchRead extends BaseModelServiceOperation {
  kind: 'searchRead'
  domain: any
  modelName: string
  optionalParameters?: any
}

interface Update extends BaseModelServiceOperation {
  kind: 'update'
  fieldsValues: any
  ids: Array<number>
  modelName: string
}

interface NameSearch extends BaseModelServiceOperation {
  kind: 'nameSearch'
  modelName: string
  nameToSearch: string
  optionalParameters?: any
}

interface DefaultGet extends BaseModelServiceOperation {
  kind: 'defaultGet'
  modelName: string
  fieldsNames: Array<string>
}

interface FieldsGet extends BaseModelServiceOperation {
  kind: 'fieldsGet'
  modelName: string
  fieldsNames?: Array<string>
  attributes?: Array<string>
}

interface NameGet extends BaseModelServiceOperation {
  kind: 'nameGet'
  modelName: string
  ids: Array<number>
}

interface OnChange extends BaseModelServiceOperation {
  kind: 'onChange'
  modelName: string
  values: any
  fieldName: Array<string>
  fieldOnChange: any
}

interface CallMethod extends BaseModelServiceOperation {
  kind: 'callMethod'
  modelName: string
  methodName: string
  args: Array<any>
  kwargs?: any
}

interface DBExist extends BaseDBServiceOperation {
  kind: 'dbExist'
  dbName: string
}

interface ListDB extends BaseDBServiceOperation {
  kind: 'listDB'
}

interface AuthorizedDBServiceOperation extends BaseDBServiceOperation {
  adminPassword: string
}

interface CreateDB extends AuthorizedDBServiceOperation {
  kind: 'createDB'
  dbName: string
  demo: boolean
  lang: string
  userPassword: string
  login: string
  countryCode: string
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

type CreateAuthenticateParams = {
  credentials: AuthenticateCredentials
}

export const createAuthenticate = ({ credentials }: CreateAuthenticateParams): Authenticate => {
  const authenticate: Authenticate = {
    kind: 'authenticate',
    serviceType: 'common',
    credentials
  }

  return authenticate
}

export const createGetVersion = (): GetVersion => {
  const getVersion: GetVersion = {
    kind: 'getVersion',
    serviceType: 'common'
  }

  return getVersion
}

type CreateCreateParams = {
  modelName: string
  fieldsValues: any
}

export const createCreate = ({ modelName, fieldsValues }: CreateCreateParams): Create => {
  const create: Create = {
    kind: 'create',
    serviceType: 'model',
    fieldsValues: fieldsValues,
    modelName: modelName
  }

  return create
}

type CreateDeleteParams = {
  modelName: string
  ids: Array<Array<number>>
}

export const createDelete = ({ modelName, ids }: CreateDeleteParams): Delete => {
  const unlink: Delete = {
    kind: 'delete',
    serviceType: 'model',
    ids: ids,
    modelName: modelName
  }

  return unlink
}

type CreateSearchParams = {
  modelName: string
  searchDomain: any
  optionalParameters: any
}

export const createSearch = ({
  modelName,
  searchDomain,
  optionalParameters
}: CreateSearchParams): Search => {
  const search: Search = {
    kind: 'search',
    serviceType: 'model',
    domain: searchDomain,
    modelName: modelName,
    optionalParameters: optionalParameters
  }

  return search
}

type CreateSearchCountParams = {
  modelName: string
  searchDomain: any
}

export const createSearchCount = ({
  modelName,
  searchDomain
}: CreateSearchCountParams): SearchCount => {
  const searchCount: SearchCount = {
    kind: 'searchCount',
    serviceType: 'model',
    domain: searchDomain,
    modelName: modelName
  }

  return searchCount
}

type CreateReadParams = {
  modelName: string
  ids: Array<Array<number>>
  fields?: Array<string>
}

export const createRead = ({ modelName, ids, fields = [] }: CreateReadParams): Read => {
  const read: Read = {
    kind: 'read',
    serviceType: 'model',
    modelName: modelName,
    ids: ids,
    fields: {
      fields: fields
    }
  }

  return read
}

type CreateSearchReadParams = {
  modelName: string
  searchDomain: any
  optionalParameters: any
}

export const createSearchRead = ({
  modelName,
  searchDomain,
  optionalParameters
}: CreateSearchReadParams): SearchRead => {
  const searchRead: SearchRead = {
    kind: 'searchRead',
    serviceType: 'model',
    domain: searchDomain,
    modelName: modelName,
    optionalParameters: optionalParameters
  }

  return searchRead
}

type CreateNameSearchParams = {
  modelName: string
  nameToSearch: string
  optionalParameters: any
}

export const createNameSearch = ({
  modelName,
  nameToSearch,
  optionalParameters
}: CreateNameSearchParams): NameSearch => {
  const nameSearch: NameSearch = {
    kind: 'nameSearch',
    serviceType: 'model',
    modelName: modelName,
    nameToSearch: nameToSearch,
    optionalParameters: optionalParameters
  }

  return nameSearch
}

type CreateUpdateParams = {
  modelName: string
  ids: Array<number>
  fieldsValues: any
}

export const createUpdate = ({ modelName, ids, fieldsValues }: CreateUpdateParams): Update => {
  const update: Update = {
    kind: 'update',
    serviceType: 'model',
    modelName: modelName,
    fieldsValues: fieldsValues,
    ids: ids
  }

  return update
}

type CreateDefaultGetParams = {
  modelName: string
  fieldsNames: Array<string>
}

export const createDefaultGet = ({
  modelName,
  fieldsNames
}: CreateDefaultGetParams): DefaultGet => {
  const defaultGet: DefaultGet = {
    kind: 'defaultGet',
    serviceType: 'model',
    modelName: modelName,
    fieldsNames: fieldsNames
  }

  return defaultGet
}

type CreateFieldsGetParams = {
  modelName: string
  fieldsNames?: Array<string>
  attributes?: Array<string>
}

export const createFieldsGet = ({
  modelName,
  fieldsNames = [],
  attributes
}: CreateFieldsGetParams): FieldsGet => {
  const fieldsGet: FieldsGet = {
    kind: 'fieldsGet',
    serviceType: 'model',
    modelName: modelName,
    fieldsNames: fieldsNames,
    attributes: attributes
  }

  return fieldsGet
}

type CreateNameGetParams = {
  modelName: string
  ids: Array<number>
}

export const createNameGet = ({ modelName, ids }: CreateNameGetParams): NameGet => {
  const nameGet: NameGet = {
    kind: 'nameGet',
    serviceType: 'model',
    modelName: modelName,
    ids: ids
  }

  return nameGet
}

type CreateOnChangeParams = {
  modelName: string
  values: any
  fieldName: Array<string>
  fieldOnChange: any
}

export const createOnChange = ({
  modelName,
  values,
  fieldName,
  fieldOnChange
}: CreateOnChangeParams): OnChange => {
  const onChange: OnChange = {
    kind: 'onChange',
    serviceType: 'model',
    modelName: modelName,
    values: values,
    fieldName: fieldName,
    fieldOnChange: fieldOnChange
  }

  return onChange
}

type CreateCallMethodParams = {
  modelName: string
  methodName: string
  args: Array<any>
  kwargs?: any
}

export const createCallMethod = ({
  modelName,
  methodName,
  args,
  kwargs
}: CreateCallMethodParams): CallMethod => {
  const callMethod: CallMethod = {
    kind: 'callMethod',
    serviceType: 'model',
    modelName: modelName,
    methodName: methodName,
    args: args,
    kwargs: kwargs
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
    dbName
  }

  return dbExist
}

export const createListDB = (): ListDB => {
  const listDB: ListDB = {
    kind: 'listDB',
    serviceType: 'db'
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
    kind: 'createDB',
    serviceType: 'db',
    adminPassword,
    dbName,
    demo,
    lang,
    userPassword,
    login,
    countryCode
  }

  return createDB
}
