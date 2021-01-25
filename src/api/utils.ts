import axios, {AxiosError} from 'axios';
import {RequestIdHeaderName} from './headers';
import {LanguageAndText} from '../reference-data/types';
import {Language} from '../translations';

export type ErrorType =
  | 'unknown'
  | 'default'
  | 'network-error'
  | 'timeout'
  | 'cancel';

export const getAxiosErrorType = (error: AxiosError): ErrorType => {
  if (error) {
    if (axios.isCancel(error)) {
      return 'cancel';
    }
    if (error.response) {
      return 'default';
    } else {
      if (error.code === 'ECONNABORTED') {
        return 'timeout';
      } else {
        return 'network-error';
      }
    }
  }

  return 'unknown';
};

export interface ErrorMetadata {
  responseStatus?: number;
  responseStatusText?: string;
  responseData?: string;
  requestUrl?: string;
  requestMessage?: string;
  requestCode?: string;
  requestId?: string;
}

export const getAxiosErrorMetadata = (error: AxiosError): ErrorMetadata => ({
  requestId: error?.config?.headers[RequestIdHeaderName],
  requestCode: error?.code,
  requestUrl: error?.config?.url,
  requestMessage: error?.message,
  responseStatus: error?.response?.status,
  responseStatusText: error?.response?.statusText,
  responseData: JSON.stringify(error?.response?.data || 'No response data'),
});

export const stringifyUrl = (url: string, query: string) => `${url}?${query}`;

/**
 * Get the text of a field in a NeTeX entity in the correct language. If English
 * is requested, it will fallback to Norwegian if no English text is found. If
 * neither English nor Norwegian is found the first text in the provided texts
 * array is returned.
 */
export const getTextInLanguage = (
  texts: LanguageAndText[],
  language: Language,
) => {
  if (language === Language.English) {
    const englishText = texts.find((t) => t.lang === 'eng');
    if (englishText) return englishText.value;
  }
  const norwegianText = texts.find((t) => t.lang === 'nor' || t.lang === 'nob');
  if (norwegianText) return norwegianText.value;

  return texts[0].value;
};

/**
 * Wrapper for getting the name of a NeTeX entity in the given language.
 */
export const getNameInLanguage = <
  T extends {
    name: LanguageAndText;
    alternativeNames?: LanguageAndText[];
  }
>(
  {name, alternativeNames}: T,
  language: Language,
) => getTextInLanguage([name, ...(alternativeNames || [])], language);
