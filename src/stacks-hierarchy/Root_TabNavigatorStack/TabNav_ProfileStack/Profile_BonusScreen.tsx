import {useState} from 'react';
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
import {ThemedCityBike} from '@atb/theme/ThemedAssets'; // TODO: update with new illustration when available
import {ContentHeading} from '@atb/components/heading';
import {
  BonusPriceTag,
  UserBonusBalance,
  isActive,
  useBonusBalanceQuery,
} from '@atb/modules/bonus';
import {useAuthContext} from '@atb/auth';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useFirestoreConfigurationContext} from '@atb/configuration';
import {BrandingImage, findOperatorBrandImageUrl} from '@atb/mobility';
import {isDefined} from '@atb/utils/presence';

export const Profile_BonusScreen = () => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {authenticationType} = useAuthContext();
  const {bonusProducts, mobilityOperators, bonusTexts} =
    useFirestoreConfigurationContext();
  const [currentlyOpenBonusProduct, setCurrentlyOpenBonusProduct] =
    useState<number>();

  const activeBonusProducts = bonusProducts?.filter(isActive);

  return (
    <FullScreenView
      headerProps={{
        title: t(BonusProgramTexts.bonusProfile.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
    >
      <View style={styles.container}>
        {authenticationType !== 'phone' && (
          <View style={styles.noAccount}>
            <MessageInfoBox
              type="warning"
              message={t(BonusProgramTexts.bonusProfile.noProfile)}
            />
          </View>
        )}
        <UserBonusBalanceSection />
        <ContentHeading
          text={t(BonusProgramTexts.bonusProfile.spendPoints.heading)}
        />
        {activeBonusProducts?.length === 0 ? (
          <View style={styles.noAccount}>
            <MessageInfoBox
              type="error"
              message={t(BonusProgramTexts.bonusProfile.noBonusProducts)}
            />
          </View>
        ) : (
          <View style={styles.bonusProductsContainer}>
            {activeBonusProducts?.map((bonusProduct, index) => (
              <Section key={bonusProduct.id}>
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
                      amount={bonusProduct.price.amount}
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
        )}
        <ContentHeading
          text={t(BonusProgramTexts.bonusProfile.readMore.heading)}
        />
        <Section>
          <GenericSectionItem>
            <View style={styles.horizontalContainer}>
              <ThemedCityBike />
              <View style={styles.bonusProgramDescription}>
                <ThemeText typography="body__primary--bold">
                  {getTextForLanguage(
                    bonusTexts?.howBonusWorks.title,
                    language,
                  ) ?? ''}
                </ThemeText>
                <ThemeText typography="body__secondary" color="secondary">
                  {getTextForLanguage(
                    bonusTexts?.howBonusWorks.description,
                    language,
                  ) ?? ''}
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
  currentBalanceDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
    minHeight: theme.typography['body__primary--jumbo'].lineHeight,
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

function UserBonusBalanceSection(): JSX.Element {
  const styles = useStyles();
  const {t} = useTranslation();
  const {data: userBonusBalance, status: userBonusBalanceStatus} =
    useBonusBalanceQuery();

  const isError =
    !isDefined(userBonusBalance) ||
    Number.isNaN(userBonusBalance) ||
    userBonusBalanceStatus === 'error';

  return (
    <>
      <Section>
        <GenericSectionItem style={styles.horizontalContainer}>
          <View
            accessible
            accessibilityLabel={t(
              BonusProgramTexts.yourBonusBalanceA11yLabel(
                userBonusBalance && userBonusBalanceStatus === 'success'
                  ? userBonusBalance
                  : null,
              ),
            )}
          >
            <View style={styles.currentBalanceDisplay}>
              <UserBonusBalance size="large" />
            </View>

            <ThemeText typography="body__secondary" color="secondary">
              {t(BonusProgramTexts.bonusProfile.yourBonusPoints)}
            </ThemeText>
          </View>
          <ThemedCityBike />
        </GenericSectionItem>
      </Section>
      {isError && (
        <MessageInfoBox
          type="error"
          message={t(BonusProgramTexts.bonusProfile.noBonusBalance)}
        />
      )}
    </>
  );
}
