export default abstract class Token {
    readonly tokenId: string
    readonly contextId: string

    protected constructor(tokenId: string, contextId: string) {
        this.tokenId = tokenId
        this.contextId = contextId
    }

    getTokenId = () => this.tokenId
    getContextId = () => this.contextId
}
