import React, {useState} from 'react';
import {
  ExpandableSectionItem,
  GenericSectionItem,
  Section,
} from '@atb/components/sections';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  BonusProgramTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {View} from 'react-native';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemedCityBike} from '@atb/theme/ThemedAssets'; // TODO: update with new illustration when available
import {StarFill} from '@atb/assets/svg/mono-icons/bonus';
import {ContentHeading} from '@atb/components/heading';
import {BonusPriceTag} from '@atb/bonus';
import {useAuthContext} from '@atb/auth';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useFirestoreConfigurationContext} from '@atb/configuration';
import {
  BrandingImage,
  findOperatorBrandImageUrl,
  isActive,
} from '@atb/mobility';

export const Profile_BonusScreen = () => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {authenticationType} = useAuthContext();
  const {bonusProducts, mobilityOperators} = useFirestoreConfigurationContext();
  const [currentlyOpenBonusProduct, setCurrentlyOpenBonusProduct] =
    useState<number>();

  const currentPoints = 5; // TODO: get actual value when available

  return (
    <FullScreenView
      headerProps={{
        title: t(BonusProgramTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
    >
      <View style={styles.container}>
        <Section>
          <GenericSectionItem style={styles.horizontalContainer}>
            <View>
              <View style={styles.currentPointsDisplay}>
                <ThemeText typography="body__primary--jumbo--bold">
                  {currentPoints}
                </ThemeText>
                <ThemeIcon
                  svg={StarFill}
                  size="large"
                  accessibilityHint={t(BonusProgramTexts.bonuspoints)}
                />
              </View>
              <ThemeText typography="body__secondary" color="secondary">
                {t(BonusProgramTexts.yourBonusPoints)}
              </ThemeText>
            </View>
            <ThemedCityBike />
          </GenericSectionItem>
        </Section>
        {authenticationType !== 'phone' && (
          <View style={styles.noAccount}>
            <MessageInfoBox
              type="warning"
              message={t(BonusProgramTexts.noProfile)}
            />
          </View>
        )}
        <ContentHeading text={t(BonusProgramTexts.spendPoints.heading)} />
        <View style={styles.bonusProductsContainer}>
          {bonusProducts?.filter(isActive).map((bonusProduct, index) => (
            <Section>
              <ExpandableSectionItem
                expanded={currentlyOpenBonusProduct === index}
                onPress={() => {
                  setCurrentlyOpenBonusProduct(index);
                }}
                text={
                  getTextForLanguage(
                    bonusProduct.productDescription.title,
                    language,
                  ) ?? ''
                }
                showIconText={false}
                prefixNode={
                  <BrandingImage
                    logoUrl={findOperatorBrandImageUrl(
                      bonusProduct.operatorId,
                      mobilityOperators,
                    )}
                    logoSize={theme.typography['heading--big'].fontSize}
                    style={styles.logo}
                  />
                }
                suffixNode={
                  <BonusPriceTag
                    price={bonusProduct.price.amount}
                    style={styles.bonusPriceTag}
                  />
                }
                expandContent={
                  <ThemeText
                    isMarkdown={true}
                    typography="body__secondary"
                    color="secondary"
                  >
                    {getTextForLanguage(
                      bonusProduct.productDescription.description,
                      language,
                    ) ?? ''}
                  </ThemeText>
                }
              />
            </Section>
          ))}
        </View>
        <ContentHeading text={t(BonusProgramTexts.readMore.heading)} />
        <Section>
          <GenericSectionItem>
            <View style={styles.horizontalContainer}>
              <ThemedCityBike />
              <View style={styles.bonusProgramDescription}>
                <ThemeText typography="body__primary--bold">
                  {t(BonusProgramTexts.readMore.info.title)}
                </ThemeText>
                <ThemeText typography="body__secondary" color="secondary">
                  {t(BonusProgramTexts.readMore.info.description)}
                </ThemeText>
              </View>
            </View>
          </GenericSectionItem>
        </Section>
      </View>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.small,
    marginTop: theme.spacing.large,
    margin: theme.spacing.medium,
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.small,
  },
  currentPointsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
  },
  noAccount: {marginTop: theme.spacing.xSmall},
  bonusProductsContainer: {
    gap: theme.spacing.medium,
  },
  bonusPriceTag: {
    marginHorizontal: theme.spacing.small,
  },
  logo: {
    marginRight: theme.spacing.small,
    borderRadius: theme.border.radius.small,
    overflow: 'hidden',
  },
  bonusProgramDescription: {
    flex: 1,
    gap: theme.spacing.xSmall,
  },
}));
