import { Either, left, right } from 'fp-ts/lib/Either'
const xmlrpc = require('xmlrpc')

import 'core-js/fn/object/values'

interface XMLRPCClient {
  methodCall: any
}

interface BaseClient {
  client: XMLRPCClient
}

interface UnauthenticatedClient extends BaseClient {
  kind: 'unauthenticated'
}

interface AuthenticatedClient extends BaseClient {
  kind: 'authenticated'
  authenticatedData: AuthenticatedData
}

export interface XMLRPCClientError {
  req: any
  res: any
  body: any
}

interface ClientOptions {
  host: string
  port: number
}

interface AuthenticationData {
  db: string
  username: string
  password: string
  dummy: {}
}

interface AuthenticatedData {
  db: string
  uid: number
  password: string
}

export const createClientOptions = (host: string, port: number): ClientOptions => {
  const clientOptions: ClientOptions = {
    host,
    port
  }
  return clientOptions
}

export const createAuthenticationData = (
  db: string,
  username: string,
  password: string
): AuthenticationData => {
  const authenticationData: AuthenticationData = {
    db,
    username,
    password,
    dummy: {}
  }

  return authenticationData
}

const createAuthenticatedData = (
  authenticationData: AuthenticationData,
  uid: number
): AuthenticatedData => {
  const authenticatedData: AuthenticatedData = {
    db: authenticationData.db,
    uid,
    password: authenticationData.password
  }

  return authenticatedData
}

export const createUnauthenticatedClient = (
  clientOptions: ClientOptions
): UnauthenticatedClient => {
  const client: XMLRPCClient = xmlrpc.createClient({
    ...clientOptions,
    path: '/xmlrpc/2/common'
  })

  return {
    kind: 'unauthenticated',
    client
  }
}

export const createAuthenticatedClient = (
  clientOptions: ClientOptions,
  authenticationData: AuthenticationData,
  uid: number
): AuthenticatedClient => {
  const client: XMLRPCClient = xmlrpc.createClient({
    ...clientOptions,
    path: '/xmlrpc/2/object'
  })

  const authenticatedData: AuthenticatedData = createAuthenticatedData(authenticationData, uid)

  return {
    kind: 'authenticated',
    authenticatedData,
    client
  }
}

interface Authenticate {
  kind: 'authenticate'
  authenticationData: AuthenticationData
}

interface FetchCommonInformation {
  kind: 'fetchCommonInformation'
}

interface Create {
  kind: 'create'
  modelName: string
  fieldsValues: any
}

interface Delete {
  kind: 'delete'
  ids: Array<Array<number>>
  modelName: string
}

interface Read {
  kind: 'read'
  fields?: any
  ids: Array<Array<number>>
  modelName: string
}

interface Search {
  kind: 'search'
  domain: any
  modelName: string
  optionalParameters?: any
}

interface SearchCount {
  kind: 'searchCount'
  domain: any
  modelName: string
}

interface SearchRead {
  kind: 'searchRead'
  domain: any
  modelName: string
  optionalParameters?: any
}

interface Update {
  kind: 'update'
  fieldsValues: any
  ids: Array<number>
  modelName: string
}

interface NameSearch {
  kind: 'nameSearch'
  modelName: string
  nameToSearch: string
  optionalParameters?: any
}

interface DefaultGet {
  kind: 'defaultGet'
  modelName: string
  fieldsNames: Array<string>
}

interface FieldsGet {
  kind: 'fieldsGet'
  modelName: string
  fieldsNames?: Array<string>
  attributes?: Array<string>
}

interface NameGet {
  kind: 'nameGet'
  modelName: string
  ids: Array<number>
}

interface OnChange {
  kind: 'onChange'
  modelName: string
  values: any
  fieldName: Array<string>
  fieldOnChange: any
}

interface BaseResult {
  result: any
}

export interface AuthenticateResult {
  kind: 'authenticate'
  uid: number
}

interface FetchCommonInformationResult extends BaseResult {
  kind: 'fetchCommonInformation'
}

export interface CreateResult extends BaseResult {
  kind: 'create'
}

interface DeleteResult extends BaseResult {
  kind: 'delete'
}

interface ReadResult extends BaseResult {
  kind: 'read'
}

interface SearchResult extends BaseResult {
  kind: 'search'
}

interface SearchCountResult extends BaseResult {
  kind: 'searchCount'
}

interface SearchReadResult extends BaseResult {
  kind: 'searchRead'
}
interface NameSearchResult extends BaseResult {
  kind: 'nameSearch'
}

interface UpdateResult extends BaseResult {
  kind: 'update'
}

interface DefaultGetResult extends BaseResult {
  kind: 'defaultGet'
}

interface FieldsGetResult extends BaseResult {
  kind: 'fieldsGet'
}

interface NameGetResult extends BaseResult {
  kind: 'nameGet'
}

interface OnChangeResult extends BaseResult {
  kind: 'onChange'
}

export type UnauthenticatedOperationResult = AuthenticateResult | FetchCommonInformationResult

export type AuthenticatedOperationResult =
  | CreateResult
  | DeleteResult
  | ReadResult
  | SearchResult
  | SearchCountResult
  | SearchReadResult
  | NameSearchResult
  | UpdateResult
  | DefaultGetResult
  | FieldsGetResult
  | NameGetResult
  | OnChangeResult

type UnauthenticatedOperation = Authenticate | FetchCommonInformation
type AuthenticatedOperation =
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

export const executeAuthenticatedClient = (
  client: AuthenticatedClient,
  operation: AuthenticatedOperation,
  callback: (result: Either<XMLRPCClientError, AuthenticatedOperationResult>) => any
): void => {
  switch (operation.kind) {
    case 'create': {
      client.client.methodCall(
        'execute_kw',
        Object.values(client.authenticatedData).concat(operation.modelName, 'create', [
          [operation.fieldsValues]
        ]),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(error))
          } else {
            callback(right(createCreateResult(value)))
          }
        }
      )
      return
    }
    case 'delete': {
      client.client.methodCall(
        'execute_kw',
        Object.values(client.authenticatedData).concat(operation.modelName, 'unlink', [
          operation.ids
        ]),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(error))
          } else {
            callback(right(createDeleteResult(value)))
          }
        }
      )
      return
    }
    case 'search': {
      client.client.methodCall(
        'execute_kw',
        Object.values(client.authenticatedData).concat(
          operation.modelName,
          'search',
          [[operation.domain]],
          operation.optionalParameters
        ),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(error))
          } else {
            callback(right(createSearchResult(value)))
          }
        }
      )
      return
    }
    case 'searchCount': {
      client.client.methodCall(
        'execute_kw',
        Object.values(client.authenticatedData).concat(operation.modelName, 'search_count', [
          [operation.domain]
        ]),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(error))
          } else {
            callback(right(createSearchCountResult(value)))
          }
        }
      )
      return
    }
    case 'searchRead': {
      client.client.methodCall(
        'execute_kw',
        Object.values(client.authenticatedData).concat(
          operation.modelName,
          'search_read',
          [[operation.domain]],
          operation.optionalParameters
        ),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(error))
          } else {
            callback(right(createSearchReadResult(value)))
          }
        }
      )
      return
    }
    case 'nameSearch': {
      client.client.methodCall(
        'execute_kw',
        Object.values(client.authenticatedData).concat(
          operation.modelName,
          'name_search',
          [[operation.nameToSearch]],
          operation.optionalParameters
        ),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(error))
          } else {
            callback(right(createNameSearchResult(value)))
          }
        }
      )
      return
    }
    case 'read': {
      client.client.methodCall(
        'execute_kw',
        Object.values(client.authenticatedData).concat(
          operation.modelName,
          'read',
          [operation.ids],
          operation.fields
        ),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(error))
          } else {
            callback(right(createReadResult(value)))
          }
        }
      )
      return
    }
    case 'update': {
      client.client.methodCall(
        'execute_kw',
        Object.values(client.authenticatedData).concat(operation.modelName, 'write', [
          [operation.ids].concat(operation.fieldsValues)
        ]),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(error))
          } else {
            callback(right(createUpdateResult(value)))
          }
        }
      )
      return
    }
    case 'defaultGet': {
      client.client.methodCall(
        'execute_kw',
        Object.values(client.authenticatedData).concat(operation.modelName, 'default_get', [
          [operation.fieldsNames]
        ]),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(error))
          } else {
            callback(right(createDefaultGetResult(value)))
          }
        }
      )
      return
    }
    case 'fieldsGet': {
      client.client.methodCall(
        'execute_kw',
        Object.values(client.authenticatedData).concat(operation.modelName, 'fields_get', [
          [operation.fieldsNames].concat(operation.attributes)
        ]),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(error))
          } else {
            callback(right(createFieldsGetResult(value)))
          }
        }
      )
      return
    }
    case 'nameGet': {
      client.client.methodCall(
        'execute_kw',
        Object.values(client.authenticatedData).concat(operation.modelName, 'name_get', [
          [operation.ids]
        ]),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(error))
          } else {
            callback(right(createNameGetResult(value)))
          }
        }
      )
      return
    }
    case 'onChange': {
      client.client.methodCall(
        'execute_kw',
        Object.values(client.authenticatedData).concat(operation.modelName, 'onchange', [
          [[], operation.values, operation.fieldName, operation.fieldOnChange]
        ]),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(error))
          } else {
            callback(right(createOnChangeResult(value)))
          }
        }
      )
      return
    }

    default:
      const exhaustiveCheck: never = operation
  }
}

export const executeUnauthenticatedClient = (
  client: UnauthenticatedClient,
  operation: UnauthenticatedOperation,
  callback: (result: Either<XMLRPCClientError, UnauthenticatedOperationResult>) => any
): void => {
  switch (operation.kind) {
    case 'authenticate': {
      client.client.methodCall(
        'authenticate',
        Object.values(operation.authenticationData),
        (error: XMLRPCClientError, value: any) => {
          if (error) {
            callback(left(error))
          } else {
            callback(right(createAuthenticateResult(value)))
          }
        }
      )
      return
    }
    case 'fetchCommonInformation': {
      client.client.methodCall('version', [], (error: XMLRPCClientError, value: any) => {
        if (error) {
          callback(left(error))
        } else {
          callback(right(createFetchCommonInformationResult(value)))
        }
      })
      return
    }

    default:
      const exhaustiveCheck: never = operation
  }
}

export const createAuthenticate = (authenticationData: AuthenticationData): Authenticate => {
  const authenticate: Authenticate = {
    kind: 'authenticate',
    authenticationData: authenticationData
  }

  return authenticate
}

export const createCreate = (modelName: string, fieldsValues: any): Create => {
  const create: Create = {
    kind: 'create',
    fieldsValues: fieldsValues,
    modelName: modelName
  }

  return create
}

export const createDelete = (modelName: string, ids: Array<Array<number>>): Delete => {
  const unlink: Delete = {
    kind: 'delete',
    ids: ids,
    modelName: modelName
  }

  return unlink
}

export const createFetchCommonInformation = (): FetchCommonInformation => {
  const fetchCommonInformation: FetchCommonInformation = {
    kind: 'fetchCommonInformation'
  }

  return fetchCommonInformation
}

export const createSearch = (
  modelName: string,
  searchDomain: any,
  optionalParameters: any
): Search => {
  const search: Search = {
    kind: 'search',
    domain: searchDomain,
    modelName: modelName,
    optionalParameters: optionalParameters
  }

  return search
}

export const createSearchCount = (modelName: string, searchDomain: any): SearchCount => {
  const searchCount: SearchCount = {
    kind: 'searchCount',
    domain: searchDomain,
    modelName: modelName
  }

  return searchCount
}

export const createRead = (
  modelName: string,
  ids: Array<Array<number>>,
  fields: Array<string> = []
): Read => {
  const read: Read = {
    kind: 'read',
    modelName: modelName,
    ids: ids,
    fields: {
      fields: fields
    }
  }

  return read
}

export const createSearchRead = (
  modelName: string,
  searchDomain: any,
  optionalParameters: any
): SearchRead => {
  const searchRead: SearchRead = {
    kind: 'searchRead',
    domain: searchDomain,
    modelName: modelName,
    optionalParameters: optionalParameters
  }

  return searchRead
}

export const createNameSearch = (
  modelName: string,
  nameToSearch: string,
  optionalParameters: any
): NameSearch => {
  const nameSearch: NameSearch = {
    kind: 'nameSearch',
    modelName: modelName,
    nameToSearch: nameToSearch,
    optionalParameters: optionalParameters
  }

  return nameSearch
}

export const createUpdate = (modelName: string, ids: Array<number>, fieldsValues: any): Update => {
  const update: Update = {
    kind: 'update',
    modelName: modelName,
    fieldsValues: fieldsValues,
    ids: ids
  }

  return update
}

export const createDefaultGet = (modelName: string, fieldsNames: Array<string>): DefaultGet => {
  const defaultGet: DefaultGet = {
    kind: 'defaultGet',
    modelName: modelName,
    fieldsNames: fieldsNames
  }

  return defaultGet
}

export const createFieldsGet = (
  modelName: string,
  fieldsNames?: Array<string>,
  attributes?: Array<string>
): FieldsGet => {
  const fieldsGet: FieldsGet = {
    kind: 'fieldsGet',
    modelName: modelName,
    fieldsNames: fieldsNames,
    attributes: attributes
  }

  return fieldsGet
}

export const createNameGet = (modelName: string, ids: Array<number>): NameGet => {
  const nameGet: NameGet = {
    kind: 'nameGet',
    modelName: modelName,
    ids: ids
  }

  return nameGet
}

export const createOnChange = (
  modelName: string,
  values: any,
  fieldName: Array<string>,
  fieldOnChange: any
): OnChange => {
  const onChange: OnChange = {
    kind: 'onChange',
    modelName: modelName,
    values: values,
    fieldName: fieldName,
    fieldOnChange: fieldOnChange
  }

  return onChange
}

const createAuthenticateResult = (uid: number): AuthenticateResult => ({
  kind: 'authenticate',
  uid
})

const createCreateResult = (uid: number): CreateResult => ({
  kind: 'create',
  result: uid
})

const createDeleteResult = (status: boolean): DeleteResult => ({
  kind: 'delete',
  result: status
})

const createFetchCommonInformationResult = (result: any): FetchCommonInformationResult => ({
  kind: 'fetchCommonInformation',
  result: result
})

const createReadResult = (result: any): ReadResult => ({
  kind: 'read',
  result: result
})

const createSearchResult = (result: any): SearchResult => ({
  kind: 'search',
  result: result
})

const createSearchCountResult = (result: any): SearchCountResult => ({
  kind: 'searchCount',
  result: result
})

const createSearchReadResult = (result: any): SearchReadResult => ({
  kind: 'searchRead',
  result: result
})

const createNameSearchResult = (result: any): NameSearchResult => ({
  kind: 'nameSearch',
  result: result
})

const createUpdateResult = (result: any): UpdateResult => ({
  kind: 'update',
  result: result
})

const createDefaultGetResult = (result: any): DefaultGetResult => ({
  kind: 'defaultGet',
  result: result
})

const createFieldsGetResult = (result: any): FieldsGetResult => ({
  kind: 'fieldsGet',
  result: result
})

const createNameGetResult = (result: any): NameGetResult => ({
  kind: 'nameGet',
  result: result
})

const createOnChangeResult = (result: any): OnChangeResult => ({
  kind: 'onChange',
  result: result
})
