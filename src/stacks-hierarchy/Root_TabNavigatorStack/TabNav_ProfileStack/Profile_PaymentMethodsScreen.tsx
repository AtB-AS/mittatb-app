import {Add} from '@atb/assets/svg/mono-icons/actions';
import SvgDelete from '@atb/assets/svg/mono-icons/actions/Delete';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {NativeTouchable} from '@atb/components/native-touchable';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {
  humanizePaymentType,
  PaymentAgreement,
  PaymentType,
  RecurringPayment,
  useAddPaymentAgreementMutation,
  useListPaymentAgreementsQuery,
  useStopPaymentAgreementMutation,
} from '@atb/modules/ticketing';
import {ProfileTexts, useTranslation} from '@atb/translations';
import PaymentMethodsTexts from '@atb/translations/screens/subscreens/PaymentMethods';
import {useFontScale} from '@atb/utils/use-font-scale';
import React, {useState} from 'react';
import {View} from 'react-native';
import {destructiveAlert} from './utils';
import {FullScreenView} from '@atb/components/screen-view';
import {ContentHeading, ScreenHeading} from '@atb/components/heading';
import {ExpiryMessage, PaymentBrand} from '@atb/modules/payment';
import {useRecurringPayment} from '@atb/modules/ticketing';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {ProfileScreenProps} from './navigation-types';
import {useManualRefreshControlProps} from '@atb/utils/use-manual-refresh-props';
import {Loading} from '@atb/components/loading';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useActiveShmoBookingQuery} from '@atb/modules/mobility';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {useAuthContext} from '@atb/modules/auth';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useGetHasReservationOrAvailableFareContract} from '@atb/modules/ticketing';
import {Button} from '@atb/components/button';
import {LogIn} from '@atb/assets/svg/mono-icons/profile';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {PaymentAgreementsSection} from './components/PaymentAgreementsSection';

type Props = ProfileScreenProps<'Profile_PaymentMethodsScreen'>;

export const Profile_PaymentMethodsScreen = ({navigation}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {
    recurringPaymentFetching,
    recurringPaymentIsLoading,
    recurringPayment,
    refetchRecurringPayment,
    deleteRecurringPayment,
    isError,
    recurringPaymentError,
    onAddRecurringPayment,
  } = useRecurringPayment();
  const {isApplePayEnabled, isVippsPaymentAgreementEnabled} =
    useFeatureTogglesContext();
  const {authenticationType} = useAuthContext();
  const isLoggedIn = authenticationType === 'phone';
  const {enable_vipps_login} = useRemoteConfigContext();
  const getHasReservationOrAvailableFareContract =
    useGetHasReservationOrAvailableFareContract();

  const isFocused = useIsFocusedAndActive();
  const {data: activeShmoBooking, isPending: isActiveShmoBookingPending} =
    useActiveShmoBookingQuery(isFocused);
  const hasActiveShmoTrip = !!activeShmoBooking;

  const [showDeleteBlockedError, setShowDeleteBlockedError] = useState(false);
  const [showStopAgreementBlockedError, setShowStopAgreementBlockedError] =
    useState(false);

  const {paymentTypes} = useFirestoreConfigurationContext();
  const showPaymentAgreements =
    isVippsPaymentAgreementEnabled && paymentTypes.includes(PaymentType.Vipps);
  const {
    data: paymentAgreements,
    isLoading: isLoadingPaymentAgreements,
    isFetching: isFetchingPaymentAgreements,
    isError: isPaymentAgreementsError,
    refetch: refetchPaymentAgreements,
  } = useListPaymentAgreementsQuery(isFocused && showPaymentAgreements);
  const addPaymentAgreement = useAddPaymentAgreementMutation();
  const stopPaymentAgreement = useStopPaymentAgreementMutation();
  const hasError =
    isError ||
    isPaymentAgreementsError ||
    addPaymentAgreement.isError ||
    stopPaymentAgreement.isError;

  const onStopPaymentAgreement = (agreement: PaymentAgreement) => {
    if (isActiveShmoBookingPending) return;
    if (hasActiveShmoTrip) {
      setShowStopAgreementBlockedError(true);
      return;
    }
    destructiveAlert({
      alertTitleString: t(PaymentMethodsTexts.agreements.stopModal.title),
      alertMessageString: t(PaymentMethodsTexts.agreements.stopModal.message),
      cancelAlertString: t(
        PaymentMethodsTexts.agreements.stopModal.cancelButton,
      ),
      confirmAlertString: t(
        PaymentMethodsTexts.agreements.stopModal.confirmButton,
      ),
      destructiveArrowFunction: () => stopPaymentAgreement.mutate(agreement.id),
    });
  };

  const focusRef = useFocusOnLoad(navigation);

  const refreshControlProps = useManualRefreshControlProps({
    refreshing: recurringPaymentFetching || isFetchingPaymentAgreements,
    onRefresh: () => {
      refetchRecurringPayment();
      if (showPaymentAgreements) refetchPaymentAgreements();
    },
  });

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title: t(PaymentMethodsTexts.header.title),
        leftButton: {type: 'back'},
      }}
      refreshControlProps={refreshControlProps}
      headerContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(PaymentMethodsTexts.header.title)}
        />
      )}
    >
      <View style={styles.content}>
        {!isLoggedIn ? (
          <>
            <MessageInfoBox
              type="warning"
              title={t(PaymentMethodsTexts.loginRequired.title)}
              message={t(PaymentMethodsTexts.loginRequired.message)}
            />
            <Button
              expanded
              text={t(
                ProfileTexts.sections.account.linkSectionItems.login.label,
              )}
              rightIcon={{svg: LogIn}}
              onPress={() => {
                if (getHasReservationOrAvailableFareContract()) {
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
          </>
        ) : (
          <>
            {hasError && (
              <MessageInfoBox
                a11yLiveRegion="polite"
                type="error"
                message={t(PaymentMethodsTexts.genericError)}
              />
            )}
            {isLoadingPaymentAgreements && <Loading />}
            {showPaymentAgreements && paymentAgreements && (
              <PaymentAgreementsSection
                agreements={paymentAgreements}
                onActivate={() => addPaymentAgreement.mutate()}
                onStop={onStopPaymentAgreement}
                isLoading={
                  addPaymentAgreement.isPending ||
                  stopPaymentAgreement.isPending
                }
              />
            )}
            {showStopAgreementBlockedError && (
              <MessageInfoBox
                title={t(
                  PaymentMethodsTexts.agreements.stopBlockedByActiveTrip.title,
                )}
                message={t(
                  PaymentMethodsTexts.agreements.stopBlockedByActiveTrip
                    .message,
                )}
                type="error"
              />
            )}
            <View style={styles.savedCards}>
              {showPaymentAgreements && (
                <ContentHeading
                  text={t(PaymentMethodsTexts.savedCardsHeading)}
                />
              )}
              {recurringPaymentIsLoading && <Loading />}
              {recurringPayment && recurringPayment.length > 0 && (
                <Section>
                  {recurringPayment.map((card) => (
                    <GenericSectionItem key={'card-' + card.id}>
                      <Card
                        card={card}
                        onDeletePress={() => {
                          if (isActiveShmoBookingPending) return;
                          if (hasActiveShmoTrip) {
                            setShowDeleteBlockedError(true);
                            return;
                          }
                          destructiveAlert({
                            alertTitleString: t(
                              PaymentMethodsTexts.deleteModal.title,
                            ),
                            alertMessageString: t(
                              PaymentMethodsTexts.deleteModal.message,
                            ),
                            cancelAlertString: t(
                              PaymentMethodsTexts.deleteModal.cancelButton,
                            ),
                            confirmAlertString: t(
                              PaymentMethodsTexts.deleteModal.confirmButton,
                            ),
                            destructiveArrowFunction: () =>
                              deleteRecurringPayment(card.id),
                          });
                        }}
                      />
                    </GenericSectionItem>
                  ))}
                </Section>
              )}
              {!recurringPaymentError &&
                !recurringPaymentFetching &&
                (!recurringPayment || recurringPayment?.length == 0) && (
                  <NoCardsInfo />
                )}

              <Section>
                <LinkSectionItem
                  text={t(PaymentMethodsTexts.addPaymentMethod)}
                  onPress={onAddRecurringPayment}
                  rightIcon={{svg: Add}}
                />
              </Section>
            </View>

            <MessageInfoBox
              message={
                isApplePayEnabled
                  ? t(PaymentMethodsTexts.vippsAndApplePayInfo)
                  : t(PaymentMethodsTexts.vippsInfo)
              }
              type="info"
            />

            {showDeleteBlockedError && (
              <MessageInfoBox
                title={t(PaymentMethodsTexts.deleteBlockedByActiveTrip.title)}
                message={t(
                  PaymentMethodsTexts.deleteBlockedByActiveTrip.message,
                )}
                type="error"
              />
            )}
          </>
        )}
      </View>
    </FullScreenView>
  );
};

const Card = (props: {card: RecurringPayment; onDeletePress: () => void}) => {
  const {card, onDeletePress} = props;
  const paymentName = humanizePaymentType(card.paymentType);
  const style = useStyles();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const fontScale = useFontScale();

  return (
    <View style={style.card}>
      <View style={style.cardTop}>
        <PaymentBrand paymentType={card.paymentType} />
        <View style={style.paymentMethod}>
          <ThemeText>{paymentName}</ThemeText>
          <ThemeText
            style={style.maskedPan}
            accessibilityLabel={t(
              PaymentMethodsTexts.a11y.cardInfo(paymentName, card.maskedPan),
            )}
          >
            **** {card.maskedPan}
          </ThemeText>
        </View>

        <View style={style.cardIcons}>
          <NativeTouchable
            variant="block"
            accessibilityLabel={t(
              PaymentMethodsTexts.a11y.deleteCardIcon(
                paymentName,
                card.maskedPan,
              ),
            )}
            style={style.actionButton}
            onPress={onDeletePress}
          >
            <ThemeText>
              {t(PaymentMethodsTexts.deleteModal.confirmButton)}
            </ThemeText>
            <SvgDelete
              height={21 * fontScale}
              width={21 * fontScale}
              fill={theme.color.foreground.dynamic.primary}
            />
          </NativeTouchable>
        </View>
      </View>

      <ExpiryMessage recurringPayment={card} />
    </View>
  );
};

const NoCardsInfo = () => {
  const {t} = useTranslation();
  return (
    <MessageInfoBox
      a11yLiveRegion="polite"
      type="info"
      message={t(PaymentMethodsTexts.noStoredCards)}
    />
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  content: {
    padding: theme.spacing.medium,
    rowGap: theme.spacing.medium,
  },
  savedCards: {
    rowGap: theme.spacing.medium,
  },
  card: {flex: 1},
  cardTop: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardIcons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  paymentMethod: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: theme.spacing.xSmall,
    paddingLeft: theme.spacing.medium,
    marginRight: 'auto',
  },
  maskedPan: {
    color: theme.color.foreground.dynamic.secondary,
  },

  actionButton: {
    marginLeft: theme.spacing.medium,
    display: 'flex',
    flexDirection: 'row',
    columnGap: theme.spacing.xSmall,
  },
}));
