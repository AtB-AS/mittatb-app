import { TokenStateError } from '../../native/errors'

export class RemoteTokenStateError extends TokenStateError {}
export class TokenMustBeRenewedRemoteTokenStateError extends RemoteTokenStateError {}
export class TokenMustBeReplacedRemoteTokenStateError extends RemoteTokenStateError {}
export class TokenMustBeReattestedRemoteTokenStateError extends RemoteTokenStateError {}
export class TokenNotFoundRemoteTokenStateError extends RemoteTokenStateError {}
export class TokenEncodingInvalidRemoteTokenStateError extends RemoteTokenStateError {}
