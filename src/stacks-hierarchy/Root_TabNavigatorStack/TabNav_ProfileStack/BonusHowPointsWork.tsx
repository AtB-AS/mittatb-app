import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {ContentHeading} from '@atb/components/heading';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {
  ThemedBonusBag,
  ThemedBonusTransaction,
  ThemedTokenPhone,
} from '@atb/theme/ThemedAssets';
import {BonusProgramTexts, dictionary, useTranslation} from '@atb/translations';
import type {Language, TranslateFunction} from '@atb/translations';
import {
  useActiveBonusProductsQuery,
  useProductPointsQuery,
  BonusProductTypeEnum,
} from '@atb/modules/bonus';

import type {ProductPointsItem} from '@atb/modules/bonus';
import {
  useFirestoreConfigurationContext,
  getReferenceDataName,
} from '@atb/modules/configuration';
import {useGetFareProductsQuery} from '@atb/modules/ticketing';
import type {PreassignedFareProduct} from '@atb/modules/ticketing';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {openUrl} from '@atb/utils/open-url';
import React from 'react';
import {Platform, View} from 'react-native';

const iconSize = 60;

export const HowPointsWork = () => {
  const {t, language} = useTranslation();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const {data: productPoints} = useProductPointsQuery();

  const pointsPerProduct = buildPointsPerProductString(
    productPoints ?? [],
    preassignedFareProducts ?? [],
    language,
    t,
  );

  return (
    <>
      <ContentHeading
        text={t(BonusProgramTexts.bonusProfile.readMore.heading)}
      />
      <Section>
        <BonusInfoSectionItem
          title={t(BonusProgramTexts.bonusProfile.readMore.earnPoints.title)}
          description={t(
            BonusProgramTexts.bonusProfile.readMore.earnPoints.description(
              pointsPerProduct,
            ),
          )}
          SymbolComponent={
            <ThemedBonusTransaction height={iconSize} width={iconSize} />
          }
        />
        <BonusInfoSectionItem
          title={t(BonusProgramTexts.bonusProfile.readMore.spendPoints.title)}
          description={t(
            BonusProgramTexts.bonusProfile.readMore.spendPoints.description,
          )}
          SymbolComponent={
            <ThemedBonusBag height={iconSize} width={iconSize} />
          }
        />
        <BonusInfoSectionItem
          title={t(BonusProgramTexts.bonusProfile.readMore.download.title)}
          description={t(
            BonusProgramTexts.bonusProfile.readMore.download.description,
          )}
          SymbolComponent={
            <ThemedTokenPhone height={iconSize} width={iconSize} />
          }
        />

        <VoucherOperatorLinks />
      </Section>
    </>
  );
};

const VoucherOperatorLinks = () => {
  const {t} = useTranslation();
  const {mobilityOperators} = useFirestoreConfigurationContext();
  const {data: activeBonusProducts} = useActiveBonusProductsQuery();

  const getOperatorName = (operatorId: string) =>
    mobilityOperators?.find((op) => op.id === operatorId)?.name ?? operatorId;

  const getPlatformAppUrl = (operatorId: string) => {
    const appUrl = mobilityOperators?.find(
      (op) => op.id === operatorId,
    )?.appUrl;
    return (Platform.OS === 'ios' ? appUrl?.ios : appUrl?.android) ?? undefined;
  };

  const uniqueVoucherOperatorIds = [
    ...new Set(
      (activeBonusProducts ?? [])
        .filter(
          (product) => product.productType === BonusProductTypeEnum.VOUCHER,
        )
        .flatMap((product) => product.operatorIds),
    ),
  ];

  return (
    <>
      {uniqueVoucherOperatorIds
        .map((operatorId) => ({
          operatorId,
          appUrl: getPlatformAppUrl(operatorId),
        }))
        .filter(({appUrl}) => appUrl)
        .map(({operatorId, appUrl}) => (
          <LinkSectionItem
            key={operatorId}
            rightIcon={{svg: ExternalLink}}
            onPress={() => openUrl(appUrl!)}
            text={t(
              BonusProgramTexts.bonusProfile.readMore.downloadOperator(
                getOperatorName(operatorId),
              ),
            )}
            accessibility={{
              accessibilityHint: t(
                dictionary.appNavigation.a11yHintForExternalContent,
              ),
              accessibilityRole: 'link',
            }}
          />
        ))}
    </>
  );
};

type BonusInfoSectionItemProps = {
  title: string;
  description: string;
  SymbolComponent: React.JSX.Element;
};

const BonusInfoSectionItem = ({
  title,
  description,
  SymbolComponent,
  ...sectionProps
}: BonusInfoSectionItemProps) => {
  const styles = useStyles();
  return (
    <GenericSectionItem {...sectionProps}>
      <View style={styles.horizontalContainer}>
        <View style={styles.bonusProgramDescription}>
          <ThemeText typography="body__m__strong">{title}</ThemeText>
          <ThemeText typography="body__s" color="secondary">
            {description}
          </ThemeText>
        </View>
        {SymbolComponent}
      </View>
    </GenericSectionItem>
  );
};

const buildPointsPerProductString = (
  productPoints: ProductPointsItem[],
  fareProducts: PreassignedFareProduct[],
  language: Language,
  t: TranslateFunction,
): string => {
  const parts = productPoints
    .map((productPoint) => {
      const fareProduct = fareProducts.find(
        (fareProduct) => fareProduct.id === productPoint.fareProduct,
      );
      if (!fareProduct) return null;
      const name = getReferenceDataName(fareProduct, language);
      return t(
        BonusProgramTexts.bonusProfile.faq.pointsPerProductLabel(
          productPoint.value,
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.large,
  },
  bonusProgramDescription: {
    flex: 1,
    gap: theme.spacing.xSmall,
  },
}));
