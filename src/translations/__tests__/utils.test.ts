import {
  LanguageAndTextLanguagesEnum,
  type LanguageAndTextType,
} from '@atb/translations/types';
import {getTextForLanguage, Language} from '@atb/translations';

const makeText = (
  lang: LanguageAndTextLanguagesEnum,
  value: string,
): LanguageAndTextType => ({
  language: lang,
  value,
});

describe('getTextForLanguage', () => {
  it('returns English text when English is requested and available', () => {
    const texts = [
      makeText(LanguageAndTextLanguagesEnum.eng, 'Hello'),
      makeText(LanguageAndTextLanguagesEnum.nob, 'Hei'),
    ];
    expect(getTextForLanguage(texts, Language.English)).toBe('Hello');
  });

  it('returns English text when alternate English key is used', () => {
    const texts = [makeText(LanguageAndTextLanguagesEnum.eng, 'Hi')];
    expect(getTextForLanguage(texts, Language.English)).toBe('Hi');
  });

  it('returns Nynorsk text when Nynorsk is requested and available', () => {
    const texts = [makeText(LanguageAndTextLanguagesEnum.nno, 'Hallo')];
    expect(getTextForLanguage(texts, Language.Nynorsk)).toBe('Hallo');
  });

  it('returns Nynorsk text when alternate Nynorsk code is used', () => {
    const texts = [makeText(LanguageAndTextLanguagesEnum.nn, 'Heisann')];
    expect(getTextForLanguage(texts, Language.Nynorsk)).toBe('Heisann');
  });

  it('falls back to Norwegian Bokmål when requested language is not found', () => {
    const texts = [makeText(LanguageAndTextLanguagesEnum.nob, 'Hei på deg')];
    expect(getTextForLanguage(texts, Language.English)).toBe('Hei på deg');
  });

  it('falls back to alternate Norwegian codes', () => {
    const texts = [makeText(LanguageAndTextLanguagesEnum.nor, 'God dag')];
    expect(getTextForLanguage(texts, Language.Nynorsk)).toBe('God dag');
  });

  it('returns undefined if texts is undefined', () => {
    expect(getTextForLanguage(undefined, Language.English)).toBeUndefined();
  });

  it('returns undefined if texts is empty', () => {
    expect(getTextForLanguage([], Language.Nynorsk)).toBeUndefined();
  });

  it('falls back to Norwegian with undefined value', () => {
    const texts = [
      {language: LanguageAndTextLanguagesEnum.eng, value: undefined},
      makeText(LanguageAndTextLanguagesEnum.nob, 'Fallback'),
    ];
    expect(getTextForLanguage(texts, Language.English)).toBe('Fallback');
  });
});
