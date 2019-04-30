import { BaseJSONRPCOperation } from '../operation'
import { BaseServiceArgs } from '../model/model'
import { Authenticate } from './authenticate'
import { GetVersion } from './getVersion'

interface CommonMethodArgs {
  [name: string]: any
}

interface CommonServiceArgs extends BaseServiceArgs {
  service: 'common'
  method: 'authenticate' | 'version'
  methodArgs: CommonMethodArgs
}

export interface BaseCommonJSONRPCOperation extends BaseJSONRPCOperation {
  serviceType: 'common'
  serviceArgs: CommonServiceArgs
}

export type CommonJSONRPCOperation = Authenticate | GetVersion
