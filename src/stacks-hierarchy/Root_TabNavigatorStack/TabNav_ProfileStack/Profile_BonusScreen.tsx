import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  BonusProgramTexts,
  ProfileTexts,
  useTranslation,
} from '@atb/translations';
import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {ThemedBonusTransaction} from '@atb/theme/ThemedAssets';
import {ContentHeading, ScreenHeading} from '@atb/components/heading';
import {
  UserBonusBalanceContent,
  useBonusBalanceQuery,
  useActiveBonusProductsQuery,
  useActiveBonusProductGroupsQuery,
  BonusProductList,
} from '@atb/modules/bonus';
import {useIsEnrolled, KnownProgramId} from '@atb/modules/enrollment';
import {useAuthContext} from '@atb/modules/auth';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {isDefined} from '@atb/utils/presence';
import {Chat} from '@atb/assets/svg/mono-icons/actions';
import {LogIn} from '@atb/assets/svg/mono-icons/profile';
import Intercom, {Space} from '@intercom/intercom-react-native';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {Button} from '@atb/components/button';
import {Loading} from '@atb/components/loading';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {ProfileScreenProps} from './navigation-types';
import {useGetHasReservationOrAvailableFareContract} from '@atb/modules/ticketing';
import {MessageInfoText} from '@atb/components/message-info-text';
import {
  GlobalMessage,
  GlobalMessageContextEnum,
} from '@atb/modules/global-messages';
import {BonusFaqSection} from './BonusFaqSection';
import {HowPointsWork} from './BonusHowPointsWork';

const iconSize = 60;

type Props = ProfileScreenProps<'Profile_BonusScreen'>;

export const Profile_BonusScreen = ({navigation}: Props) => {
  const focusRef = useFocusOnLoad(navigation);
  const {t} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {authenticationType} = useAuthContext();
  const {enable_vipps_login} = useRemoteConfigContext();
  const isLoggedIn = authenticationType === 'phone';
  const {
    data: activeBonusProducts,
    isLoading: isBonusProductsLoading,
    isError: isBonusProductsError,
  } = useActiveBonusProductsQuery();
  const {
    data: activeBonusProductGroups,
    isLoading: isBonusGroupsLoading,
    isError: isBonusGroupsError,
  } = useActiveBonusProductGroupsQuery();
  const getHasReservationOrAvailableFareContract =
    useGetHasReservationOrAvailableFareContract();

  const isEnrolled = useIsEnrolled(KnownProgramId.BONUS);
  const wasEnrolledRef = useRef(isEnrolled);
  const [hasJustEnrolled, setHasJustEnrolled] = useState(false);

  useEffect(() => {
    if (!wasEnrolledRef.current && isEnrolled) {
      setHasJustEnrolled(true);
    }
    wasEnrolledRef.current = isEnrolled;
  }, [isEnrolled]);

  const {data: userBonusBalance, status: userBonusBalanceStatus} =
    useBonusBalanceQuery();

  const isBonusBalanceError =
    !isDefined(userBonusBalance) ||
    Number.isNaN(userBonusBalance) ||
    userBonusBalanceStatus === 'error';
  const analytics = useAnalyticsContext();

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title: t(BonusProgramTexts.bonusProfile.header.title),
        leftButton: {type: 'back'},
      }}
      headerContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(BonusProgramTexts.bonusProfile.header.title)}
        />
      )}
    >
      <View style={styles.container}>
        <GlobalMessage
          globalMessageContext={GlobalMessageContextEnum.appPointsScreen}
          textColor={theme.color.background.neutral[0]}
        />
        {!isEnrolled && (
          <>
            <View style={styles.wantToJoinIcon}>
              <ThemedBonusTransaction
                height={2 * iconSize}
                width={2 * iconSize}
              />
            </View>
            <Section>
              <GenericSectionItem style={{gap: theme.spacing.large}}>
                <ThemeText typography="heading__xl" type="primary">
                  {t(BonusProgramTexts.bonusProfile.joinProgram.title)}
                </ThemeText>
                <ThemeText typography="body__m" type="primary">
                  {t(BonusProgramTexts.bonusProfile.joinProgram.description)}
                </ThemeText>
                <ThemeText typography="body__m" type="primary">
                  {t(BonusProgramTexts.bonusProfile.joinProgram.footer)}
                </ThemeText>
              </GenericSectionItem>
            </Section>
            <Button
              expanded
              text={
                isLoggedIn
                  ? t(BonusProgramTexts.bonusProfile.joinProgram.button.text)
                  : t(
                      ProfileTexts.sections.account.linkSectionItems.login
                        .label,
                    )
              }
              rightIcon={!isLoggedIn ? {svg: LogIn} : undefined}
              style={styles.button}
              onPress={() => {
                if (isLoggedIn) {
                  navigation.navigate('Root_OnboardingCarouselStack', {
                    configId: KnownProgramId.BONUS,
                  });
                } else if (getHasReservationOrAvailableFareContract()) {
                  navigation.navigate(
                    'Root_LoginAvailableFareContractWarningScreen',
                    {},
                  );
                } else if (enable_vipps_login) {
                  navigation.navigate('Root_LoginOptionsScreen', {
                    showGoBack: true,
                    transitionOverride: 'slide-from-bottom',
                  });
                } else {
                  navigation.navigate('Root_LoginPhoneInputScreen', {});
                }
              }}
            />
            {!isLoggedIn && (
              <MessageInfoText
                style={styles.messageInfo}
                type="warning"
                message={t(BonusProgramTexts.bonusProfile.noProfile)}
              />
            )}
          </>
        )}

        {isEnrolled && (
          <>
            {hasJustEnrolled && (
              <MessageInfoBox
                type="valid"
                title={
                  !!userBonusBalance
                    ? t(BonusProgramTexts.bonusProfile.joined.title)
                    : undefined
                }
                message={t(
                  !!userBonusBalance
                    ? BonusProgramTexts.bonusProfile.joined.welcomeGiftDescription(
                        userBonusBalance,
                      )
                    : BonusProgramTexts.bonusProfile.joined.title,
                )}
              />
            )}
            <Section>
              <GenericSectionItem>
                <UserBonusBalanceContent />
              </GenericSectionItem>
              <LinkSectionItem
                text={t(BonusProgramTexts.myCouponCodes.linkText)}
                onPress={() => {
                  analytics.logEvent('Bonus', 'My coupon codes clicked');
                  navigation.navigate('Profile_BonusCouponCodesScreen');
                }}
              />
            </Section>
            {isBonusBalanceError && (
              <MessageInfoBox
                type="error"
                message={t(BonusProgramTexts.bonusProfile.noBonusBalance)}
              />
            )}
            <HowPointsWork />
          </>
        )}

        <ContentHeading
          text={t(BonusProgramTexts.bonusProfile.spendPoints.heading)}
        />
        {isBonusProductsLoading || isBonusGroupsLoading ? (
          <Loading size="large" />
        ) : isBonusProductsError ||
          isBonusGroupsError ||
          activeBonusProductGroups?.length === 0 ? (
          <View style={styles.noAccount}>
            <MessageInfoBox
              type="error"
              message={t(BonusProgramTexts.bonusProfile.noBonusProducts)}
            />
          </View>
        ) : (
          activeBonusProductGroups &&
          activeBonusProducts && (
            <BonusProductList
              bonusProductGroups={activeBonusProductGroups}
              bonusProducts={activeBonusProducts}
              onNavigateToMap={(initialFilters) =>
                navigation.navigate('Root_TabNavigatorStack', {
                  screen: 'TabNav_MapStack',
                  params: {
                    screen: 'Map_RootScreen',
                    params: {initialFilters},
                  },
                })
              }
            />
          )
        )}
        <ContentHeading text={t(BonusProgramTexts.bonusProfile.faq.heading)} />
        <BonusFaqSection />

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
  noAccount: {marginTop: theme.spacing.xSmall},
  wantToJoinIcon: {
    alignItems: 'center',
  },
  button: {
    marginTop: theme.spacing.small,
  },
  messageInfo: {
    marginTop: theme.spacing.small,
  },
}));
