import {useState} from 'react';
import {
  ExpandableSectionItem,
  GenericSectionItem,
  LinkSectionItem,
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
import {
  ThemedBonusBagHug,
  ThemedBonusTransaction,
} from '@atb/theme/ThemedAssets';
import {ContentHeading} from '@atb/components/heading';
import {
  BonusPriceTag,
  UserBonusBalance,
  bonusPilotEnrollmentId,
  isActive,
  useBonusBalanceQuery,
} from '@atb/modules/bonus';
import {useAuthContext} from '@atb/modules/auth';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {BrandingImage, findOperatorBrandImageUrl} from '@atb/modules/mobility';
import {isDefined} from '@atb/utils/presence';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StarFill} from '@atb/assets/svg/mono-icons/bonus';
import {useFontScale} from '@atb/utils/use-font-scale';
import {Chat} from '@atb/assets/svg/mono-icons/actions';
import Intercom, {Space} from '@intercom/intercom-react-native';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '@atb/stacks-hierarchy';

export const Profile_BonusScreen = () => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {authenticationType} = useAuthContext();
  const {bonusProducts, mobilityOperators, bonusTexts} =
    useFirestoreConfigurationContext();
  const [currentlyOpenBonusProduct, setCurrentlyOpenBonusProduct] =
    useState<number>();

  const navigation = useNavigation<RootNavigationProps>();

  const activeBonusProducts = bonusProducts?.filter(isActive);
  const analytics = useAnalyticsContext();

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
            <Section>
              {activeBonusProducts?.map((bonusProduct, index) => (
                <ExpandableSectionItem
                  expanded={currentlyOpenBonusProduct === index}
                  key={bonusProduct.id}
                  onPress={() => {
                    analytics.logEvent('Bonus', 'Bonus product clicked', {
                      bonusProductId: bonusProduct.id,
                      expanded: currentlyOpenBonusProduct != index,
                    });
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
                    <BonusPriceTag amount={bonusProduct.price.amount} />
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
              ))}
            </Section>
          </View>
        )}
        <ContentHeading
          text={t(BonusProgramTexts.bonusProfile.readMore.heading)}
        />
        <Section>
          <GenericSectionItem>
            <View style={styles.horizontalContainer}>
              <ThemedBonusTransaction
                height={61}
                width={61}
                style={{
                  alignSelf: 'flex-start',
                }}
              />
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
          <LinkSectionItem
            text={t(BonusProgramTexts.bonusProfile.readMore.button)}
            onPress={() => {
              navigation.navigate('Root_OnboardingCarouselStack', {
                configId: bonusPilotEnrollmentId,
              });
            }}
          />
        </Section>
        <ContentHeading
          text={t(BonusProgramTexts.bonusProfile.feedback.heading)}
        />
        <Section>
          <LinkSectionItem
            text={t(BonusProgramTexts.bonusProfile.feedback.button)}
            rightIcon={{svg: Chat}}
            onPress={() => {
              analytics.logEvent('Bonus', 'Feedback button clicked');
              Intercom.presentSpace(Space.home);
            }}
          />
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
    gap: theme.spacing.medium,
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
  logo: {
    borderRadius: theme.border.radius.small,
    overflow: 'hidden',
  },
  bonusProgramDescription: {
    flex: 1,
    gap: theme.spacing.xSmall,
  },
}));

function UserBonusBalanceSection(): React.JSX.Element {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const fontScale = useFontScale();
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
              <UserBonusBalance
                typography="body__primary--jumbo--bold"
                color={theme.color.foreground.dynamic.primary}
              />
              <ThemeIcon
                color={theme.color.foreground.dynamic.primary}
                svg={StarFill}
                size="large"
              />
            </View>

            <ThemeText typography="body__secondary" color="secondary">
              {t(BonusProgramTexts.bonusProfile.yourBonusPoints)}
            </ThemeText>
          </View>
          <ThemedBonusBagHug height={fontScale * 61} width={fontScale * 61} />
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
