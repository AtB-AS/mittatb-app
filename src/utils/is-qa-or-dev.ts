import {IS_QA_ENV} from '@env';

export const IS_QA_OR_DEV = !!JSON.parse(IS_QA_ENV || 'false') || __DEV__;
