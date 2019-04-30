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
