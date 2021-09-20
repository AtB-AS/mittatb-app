import type { Token } from '../native/types';
import type { Fetch, Hosts } from '../config';
export declare function isTokenValid({ tokenValidityStart, tokenValidityEnd, }: Token): boolean;
export declare function createRenewToken(fetcher: Fetch, hosts: Hosts): (token: Token) => Promise<Token>;
export declare function createInitToken(fetcher: Fetch, hosts: Hosts): () => Promise<Token>;
