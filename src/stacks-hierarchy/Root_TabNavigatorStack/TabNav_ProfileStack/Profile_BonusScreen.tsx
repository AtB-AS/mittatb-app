import React from 'react';
import {
  ExpandableSectionItem,
  GenericSectionItem,
  Section,
} from '@atb/components/sections';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  BonusProfileTexts,
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
import {BrandingImage} from '@atb/mobility/components/BrandingImage';
import {useFirestoreConfigurationContext} from '@atb/configuration';

export const Profile_BonusScreen = () => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {authenticationType} = useAuthContext();
  const {bonusProducts, mobilityOperators} = useFirestoreConfigurationContext();

  const currentPoints = 5; // TODO: get actual value when available

  return (
    <FullScreenView
      headerProps={{
        title: t(BonusProfileTexts.header.title),
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
                <ThemeIcon svg={StarFill} size="large" />
              </View>
              <ThemeText typography="body__secondary">
                {t(BonusProfileTexts.yourBonusPoints)}
              </ThemeText>
            </View>
            <ThemedCityBike />
          </GenericSectionItem>
        </Section>
        {authenticationType !== 'phone' && (
          <View style={styles.noAccount}>
            <MessageInfoBox
              type="warning"
              message={t(BonusProfileTexts.noProfile)}
            />
          </View>
        )}
        <ContentHeading text={t(BonusProfileTexts.spendPoints.heading)} />
        {bonusProducts?.map(
          (bonusProduct) =>
            bonusProduct.isActive && (
              <Section>
                <ExpandableSectionItem
                  text={
                    getTextForLanguage(
                      bonusProduct.productDescription.title,
                      language,
                    ) ?? ''
                  }
                  showIconText={false}
                  prefix={
                    <BrandingImage
                      logoUrl={
                        mobilityOperators?.find(
                          (op) => op.id === bonusProduct.operatorId,
                        )?.brandAssets?.brandImageUrl
                      }
                      logoSize={theme.typography['heading--big'].fontSize}
                      style={styles.logo}
                    />
                  }
                  suffix={
                    <BonusPriceTag
                      price={bonusProduct.price.amount}
                      style={styles.bonusPriceTag}
                    />
                  }
                  expandContent={
                    <ThemeText isMarkdown={true}>
                      {getTextForLanguage(
                        bonusProduct.productDescription.description,
                        language,
                      ) ?? ''}
                    </ThemeText>
                  }
                />
              </Section>
            ),
        )}
        <ContentHeading text={t(BonusProfileTexts.readMore.heading)} />
        <Section>
          <GenericSectionItem>
            <View style={styles.horizontalContainer}>
              <ThemedCityBike />
              <View style={{flex: 1}}>
                <ThemeText typography="body__primary--bold">
                  {t(BonusProfileTexts.readMore.info.title)}
                </ThemeText>
                <ThemeText typography="body__secondary">
                  {t(BonusProfileTexts.readMore.info.description)}
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
  bonusPriceTag: {
    marginRight: theme.spacing.small,
  },
  logo: {
    marginRight: theme.spacing.small,
    borderRadius: theme.border.radius.small,
    overflow: 'hidden',
  },
}));
