import React, {useEffect, useState} from 'react';
import {getTextForLanguage, Language, useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import firestore from '@react-native-firebase/firestore';
import {TipRaw, TipType} from '@atb/tips-and-information/types';
import {mapToTips} from '@atb/tips-and-information/converters';
import {ExpandableSectionItem, Section} from '@atb/components/sections';

export const TipsAndInformation = () => {
  const {language} = useTranslation();
  const [currentlyOpen, setCurrentlyOpen] = useState<number>();

  const [tips, setTips] = useState<TipType[]>([]);

  useEffect(
    () =>
      firestore()
        .collection<TipRaw>('tipsAndInformation')
        .onSnapshot(
          (snapshot) => {
            setTips(mapToTips(snapshot.docs));
          },
          (err) => {
            console.warn(err);
          },
        ),
    [],
  );

  return (
    <Section>
      {tips.sort(byTitle(language)).map((tip, index) => {
        const title = getTextForLanguage(tip.title, language);
        const description = getTextForLanguage(tip.description, language);

        if (!title || !description) return null;

        return (
          <ExpandableSectionItem
            key={title + description}
            textType="body__primary--bold"
            text={title}
            showIconText={false}
            expanded={currentlyOpen === index}
            onPress={() => {
              setCurrentlyOpen(index);
            }}
            expandContent={
              <ThemeText
                typography="body__secondary"
                color="secondary"
                isMarkdown={true}
              >
                {description}
              </ThemeText>
            }
          />
        );
      })}
    </Section>
  );
};

const byTitle = (language: Language) => (a: TipType, b: TipType) => {
  const titleA = getTextForLanguage(a.title, language);
  const titleB = getTextForLanguage(b.title, language);
  if (titleA === undefined && titleB === undefined) {
    return 0;
  }

  if (titleA === undefined || titleB === undefined) {
    return titleA === undefined ? -1 : 1;
  }

  return titleA.localeCompare(titleB);
};
