import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  BonusProgramTexts,
  dictionary,
  ProfileTexts,
  useTranslation,
} from '@atb/translations';
import type {Language, TranslateFunction} from '@atb/translations';
import React, {useEffect, useRef, useState} from 'react';
import {Platform, View} from 'react-native';
import {openUrl} from '@atb/utils/open-url';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {
  ThemedBonusBag,
  ThemedBonusTransaction,
  ThemedTokenPhone,
} from '@atb/theme/ThemedAssets';
import {ContentHeading, ScreenHeading} from '@atb/components/heading';
import {
  UserBonusBalanceContent,
  isActive,
  useBonusBalanceQuery,
  useProductPointsQuery,
  BonusProductList,
} from '@atb/modules/bonus';
import type {ProductPointsItem} from '@atb/modules/bonus';
import {
  useIsEnrolled,
  useProgramQuery,
  KnownProgramId,
} from '@atb/modules/enrollment';
import {useAuthContext} from '@atb/modules/auth';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {
  useFirestoreConfigurationContext,
  getReferenceDataName,
} from '@atb/modules/configuration';
import {isDefined} from '@atb/utils/presence';
import {Chat} from '@atb/assets/svg/mono-icons/actions';
import {LogIn} from '@atb/assets/svg/mono-icons/profile';
import Intercom, {Space} from '@intercom/intercom-react-native';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {Button} from '@atb/components/button';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {ProfileScreenProps} from './navigation-types';
import {useGetFareProductsQuery} from '@atb/modules/ticketing';
import type {PreassignedFareProduct} from '@atb/modules/ticketing';
import {formatToDate} from '@atb/utils/date';
import {MessageInfoText} from '@atb/components/message-info-text';
import {
  GlobalMessage,
  GlobalMessageContextEnum,
} from '@atb/modules/global-messages';
import {BonusFaqSection} from './BonusFaqSection';

const iconSize = 60;

type Props = ProfileScreenProps<'Profile_BonusScreen'>;

export const Profile_BonusScreen = ({navigation}: Props) => {
  const focusRef = useFocusOnLoad(navigation);
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {authenticationType} = useAuthContext();
  const {enable_vipps_login} = useRemoteConfigContext();
  const isLoggedIn = authenticationType === 'phone';
  const {bonusProducts} = useFirestoreConfigurationContext();

  const isEnrolled = useIsEnrolled(KnownProgramId.BONUS);
  const wasEnrolledRef = useRef(isEnrolled);
  const [hasJustEnrolled, setHasJustEnrolled] = useState(false);

  useEffect(() => {
    if (!wasEnrolledRef.current && isEnrolled) {
      setHasJustEnrolled(true);
    }
    wasEnrolledRef.current = isEnrolled;
  }, [isEnrolled]);

  const bonusProgram = useProgramQuery(KnownProgramId.BONUS);
  const endDateString = bonusProgram?.endAt
    ? formatToDate(bonusProgram.endAt, language)
    : '';
  const {data: userBonusBalance, status: userBonusBalanceStatus} =
    useBonusBalanceQuery();

  const isBonusBalanceError =
    !isDefined(userBonusBalance) ||
    Number.isNaN(userBonusBalance) ||
    userBonusBalanceStatus === 'error';
  const activeBonusProducts = bonusProducts?.filter(isActive);
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
                <ThemeText typography="heading__xl" color="primary">
                  {t(BonusProgramTexts.bonusProfile.joinProgram.title)}
                </ThemeText>
                <ThemeText typography="body__m" color="primary">
                  {t(BonusProgramTexts.bonusProfile.joinProgram.description)}
                </ThemeText>
                <ThemeText typography="body__m" color="primary">
                  {t(
                    BonusProgramTexts.bonusProfile.joinProgram.footer(
                      endDateString,
                    ),
                  )}
                </ThemeText>
              </GenericSectionItem>
            </Section>
            {!isLoggedIn && (
              <MessageInfoText
                style={styles.messageInfo}
                type="warning"
                message={t(BonusProgramTexts.bonusProfile.noProfile)}
              />
            )}
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
            </Section>
            {isBonusBalanceError && (
              <MessageInfoBox
                type="error"
                message={t(BonusProgramTexts.bonusProfile.noBonusBalance)}
              />
            )}
          </>
        )}
        <HowPointsWork />

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
          activeBonusProducts && (
            <BonusProductList
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
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.large,
  },
  currentBalanceDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
    minHeight: theme.typography['heading__xl'].lineHeight,
  },
  noAccount: {marginTop: theme.spacing.xSmall},
  wantToJoinIcon: {
    alignItems: 'center',
  },
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
  button: {
    marginTop: theme.spacing.small,
  },
  messageInfo: {
    marginTop: theme.spacing.small,
  },
}));

const HowPointsWork = () => {
  const {t, language} = useTranslation();
  const {bonusProducts, mobilityOperators} = useFirestoreConfigurationContext();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const {data: productPoints} = useProductPointsQuery();

  const pointsPerProduct = buildPointsPerProductString(
    productPoints ?? [],
    preassignedFareProducts ?? [],
    language,
    t,
  );

  const getOperatorName = (operatorId: string) => {
    return (
      mobilityOperators?.find((op) => op.id === operatorId)?.name ?? operatorId
    );
  };

  const getPlatformAppUrl = (operatorId: string) => {
    const appUrl = mobilityOperators?.find(
      (op) => op.id === operatorId,
    )?.appUrl;
    return (Platform.OS === 'ios' ? appUrl?.ios : appUrl?.android) ?? undefined;
  };

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

        {bonusProducts?.map((product) => {
          const appUrl = getPlatformAppUrl(product.operatorId);
          if (appUrl) {
            return (
              <LinkSectionItem
                key={product.operatorId}
                rightIcon={{svg: ExternalLink}}
                onPress={() => openUrl(appUrl)}
                text={t(
                  BonusProgramTexts.bonusProfile.readMore.downloadOperator(
                    getOperatorName(product.operatorId),
                  ),
                )}
                accessibility={{
                  accessibilityHint: t(
                    dictionary.appNavigation.a11yHintForExternalContent,
                  ),
                  accessibilityRole: 'link',
                }}
              />
            );
          }
        })}
      </Section>
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
