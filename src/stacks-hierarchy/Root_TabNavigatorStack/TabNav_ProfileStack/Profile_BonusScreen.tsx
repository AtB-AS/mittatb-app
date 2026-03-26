import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  BonusProgramTexts,
  dictionary,
  getTextForLanguage,
  Language,
  ProfileTexts,
  useTranslation,
} from '@atb/translations';
import {Linking, Platform, View} from 'react-native';
import {FullScreenView} from '@atb/components/screen-view';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {
  ThemedBonusMap,
  ThemedBonusTransaction,
  ThemedTokenPhone,
} from '@atb/theme/ThemedAssets';
import {ContentHeading, ScreenHeading} from '@atb/components/heading';
import {
  BonusPriceTag,
  UserBonusBalanceContent,
  isActive,
  useBonusBalanceQuery,
} from '@atb/modules/bonus';
import {
  useIsEnrolled,
  useProgram,
  KnownProgramId,
} from '@atb/modules/enrollment';
import {useAuthContext} from '@atb/modules/auth';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {
  BonusProductType,
  useFirestoreConfigurationContext,
} from '@atb/modules/configuration';
import {BrandingImage, findOperatorBrandImageUrl} from '@atb/modules/mobility';
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
import {useFontScale} from '@atb/utils/use-font-scale';
import {TFunc} from '@leile/lobo-t';
import {formatToDate} from '@atb/utils/date';
import {MessageInfoText} from '@atb/components/message-info-text';

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
  const {bonusProducts, mobilityOperators} = useFirestoreConfigurationContext();
  const fontScale = useFontScale();

  const isEnrolled = useIsEnrolled(KnownProgramId.BONUS);
  const bonusProgram = useProgram(KnownProgramId.BONUS);
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
              {activeBonusProducts?.map((bonusProduct) => (
                <GenericSectionItem
                  key={bonusProduct.id}
                  style={{gap: theme.spacing.medium}}
                  accessibility={{
                    accessible: true,
                    accessibilityLabel: bonusProductA11yLabel(
                      bonusProduct,
                      language,
                      t,
                    ),
                  }}
                >
                  <View style={styles.horizontalContainer}>
                    <BrandingImage
                      logoUrl={findOperatorBrandImageUrl(
                        bonusProduct.operatorId,
                        mobilityOperators,
                      )}
                      logoSize={
                        theme.typography['heading__xl'].fontSize * fontScale
                      }
                      style={styles.logo}
                    />
                    <ThemeText style={{flex: 1}}>
                      {getTextForLanguage(
                        bonusProduct.productDescription.title,
                        language,
                      ) ?? ''}
                    </ThemeText>
                    <BonusPriceTag amount={bonusProduct.price.amount} />
                  </View>
                  <ThemeText
                    isMarkdown={true}
                    typography="body__s"
                    color="secondary"
                  >
                    {getTextForLanguage(
                      bonusProduct.productDescription.description,
                      language,
                    ) ?? ''}
                  </ThemeText>
                </GenericSectionItem>
              ))}
            </Section>
          </View>
        )}
        <HowPointsWork />
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

const bonusProductA11yLabel = (
  bonusProduct: BonusProductType,
  language: Language,
  t: TFunc<typeof Language>,
) => {
  return (
    (getTextForLanguage(bonusProduct.productDescription.title, language) ??
      '') +
    screenReaderPause +
    t(BonusProgramTexts.costA11yLabel(bonusProduct.price.amount)) +
    screenReaderPause +
    (getTextForLanguage(
      bonusProduct.productDescription.description,
      language,
    ) ?? '')
  );
};

const HowPointsWork = () => {
  const {t} = useTranslation();
  const {bonusProducts, mobilityOperators} = useFirestoreConfigurationContext();

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
                onPress={() => Linking.openURL(appUrl)}
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

        <BonusInfoSectionItem
          title={t(BonusProgramTexts.bonusProfile.readMore.earnPoints.title)}
          description={t(
            BonusProgramTexts.bonusProfile.readMore.earnPoints.description,
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
            <ThemedBonusMap height={iconSize} width={iconSize} />
          }
        />
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
