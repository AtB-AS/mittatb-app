import type { StoredToken } from '@entur/react-native-traveller';
export declare const verifyCorrectTokenId: (initialTokenId: string, tokenId: string) => void;
export declare const getStoreKey: (accountId: string) => string;
export declare const missingNetConnection: () => Promise<boolean>;
export declare const isTokenInspectable: (tokens: StoredToken[], tokenId: string) => boolean;
