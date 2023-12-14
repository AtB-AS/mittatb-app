import React, {useEffect, useState} from 'react';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import firestore from '@react-native-firebase/firestore';
import {TipRaw, TipType} from '@atb/tips-and-information/types';
import {mapToTips} from '@atb/tips-and-information/converters';
import {ExpandableSectionItem, Section} from '@atb/components/sections';
import {sortTipsByTitle} from '@atb/tips-and-information/sort-tips-by-title';

export const TipsAndInformation = () => {
  const {language} = useTranslation();
  const [currentlyOpen, setCurrentlyOpen] = useState<number>();

  const [tips, setTips] = useState<TipType[]>([]);

  useEffect(
    () =>
      firestore()
        .collection<TipRaw>('tipsAndInformation')
        .onSnapshot(
          async (snapshot) => {
            const newTips = mapToTips(snapshot.docs);
            const sortedTips = sortTipsByTitle(newTips, language);
            setTips(sortedTips);
          },
          (err) => {
            console.warn(err);
          },
        ),
    /*
    Resubscribing on language change? Doh. Note that we shouldn't have
    translation logic in firestore subscription handlers.
     */
    [language],
  );

  return (
    <Section>
      {tips.map((tip, index) => {
        const title = getTextForLanguage(tip.title, language);
        const emoji = tip.emoji;
        const description = getTextForLanguage(tip.description, language);

        if (!emoji || !title || !description) return null;

        return (
          <ExpandableSectionItem
            key={index}
            textType="body__primary--bold"
            text={emoji + ' ' + title}
            showIconText={false}
            expanded={currentlyOpen === index}
            onPress={() => {
              setCurrentlyOpen(index);
            }}
            expandContent={
              <ThemeText
                type="body__secondary"
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
