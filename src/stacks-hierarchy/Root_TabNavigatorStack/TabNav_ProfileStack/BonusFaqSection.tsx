import {BonusProgramTexts, dictionary, useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {ExpandableSectionItem, Section} from '@atb/components/sections';
import {useProgramQuery, KnownProgramId} from '@atb/modules/enrollment';
import {useProductPointsQuery} from '@atb/modules/bonus';
import type {ProductPointsItem} from '@atb/modules/bonus';
import {useGetFareProductsQuery} from '@atb/modules/ticketing';
import {getReferenceDataName} from '@atb/modules/configuration';
import {formatToVerboseFullDate} from '@atb/utils/date';
import type {PreassignedFareProduct} from '@atb/modules/ticketing';
import type {Language, TranslateFunction} from '@atb/translations';

export const BonusFaqSection = () => {
  const {t, language} = useTranslation();
  const bonusProgram = useProgramQuery(KnownProgramId.BONUS);
  const endDateString = bonusProgram?.endAt
    ? formatToVerboseFullDate(bonusProgram.endAt, language)
    : '';
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const {data: productPoints} = useProductPointsQuery();

  const pointsPerProduct = buildPointsPerProductString(
    productPoints,
    preassignedFareProducts,
    language,
    t,
  );

  const faqContext = {
    endDate: endDateString,
    pointsPerProduct,
  };

  return (
    <Section>
      {
        // eslint-disable-next-line rulesdir/translations-warning
        BonusProgramTexts.bonusProfile.faq.faqs.map(
          ({question, answer}, index) => (
            <ExpandableSectionItem
              key={index}
              text={t(question)}
              showIconText={false}
              expandContent={
                <ThemeText isMarkdown={false} color="secondary">
                  {t(answer(faqContext))}
                </ThemeText>
              }
            />
          ),
        )
      }
    </Section>
  );
};

/**
 * Builds a human-readable string describing how many points each ticket type earns.
 * Handles multiple or a single ticket type.
 */
const buildPointsPerProductString = (
  productPoints: ProductPointsItem[] | undefined,
  fareProducts: PreassignedFareProduct[],
  language: Language,
  t: TranslateFunction,
): string => {
  const parts = (productPoints ?? [])
    .map((pp) => {
      const fareProduct = fareProducts.find((fp) => fp.id === pp.fareProduct);
      if (!fareProduct) return null;
      const name = getReferenceDataName(fareProduct, language);
      return t(
        BonusProgramTexts.bonusProfile.faq.pointsPerProductLabel(
          pp.value,
          name.toLowerCase(),
        ),
      );
    })
    .filter(Boolean);

  if (parts.length <= 1) return parts.join('');
  return (
    parts.slice(0, -1).join(', ') +
    ' ' +
    t(dictionary.listConcatWord) +
    ' ' +
    parts[parts.length - 1]
  );
};
