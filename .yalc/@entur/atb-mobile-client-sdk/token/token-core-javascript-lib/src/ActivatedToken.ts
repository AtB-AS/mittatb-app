import Token from './Token'

export default class ActivatedToken extends Token {
    readonly validityStart: number
    readonly validityEnd: number
    private renewToken?: Token
    private invalidated: boolean

    constructor(
        tokenId: string,
        validityStart: number,
        validityEnd: number,
        contextId: string,
        renewToken?: Token,
    ) {
        super(tokenId, contextId)
        this.validityStart = validityStart
        this.validityEnd = validityEnd
        this.renewToken = renewToken
        this.invalidated = false
    }

    getValidityStart = () => this.validityStart
    getValidityEnd = () => this.validityEnd

    isEnded = (now: number) => now > this.validityEnd
    willEndInLessThan = (now: number, minimumTimeToLive: number) =>
        this.isEnded(now + minimumTimeToLive)

    hasRenewToken = () => !!this.renewToken
    getRenewToken = () => this.renewToken
    setRenewToken = (token: Token) => (this.renewToken = token)

    markMustBeRenewed = () => (this.invalidated = true)
    mustBeRenewed = () => this.invalidated

    // TODO: What to return?
    toJSON = () => ({
        validityStart: this.validityStart,
    })
}
