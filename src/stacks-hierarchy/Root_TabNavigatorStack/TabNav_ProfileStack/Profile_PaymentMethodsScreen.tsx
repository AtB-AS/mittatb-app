import {Add} from '@atb/assets/svg/mono-icons/actions';
import SvgDelete from '@atb/assets/svg/mono-icons/actions/Delete';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {humanizePaymentType, RecurringPayment} from '@atb/modules/ticketing';
import {useTranslation} from '@atb/translations';
import PaymentMethodsTexts from '@atb/translations/screens/subscreens/PaymentMethods';
import {useFontScale} from '@atb/utils/use-font-scale';
import React from 'react';
import {RefreshControl, View} from 'react-native';
import {destructiveAlert} from './utils';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {ExpiryMessage, PaymentBrand} from '@atb/modules/payment';
import {useRecurringPayment} from '@atb/modules/ticketing';

export const Profile_PaymentMethodsScreen = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {
    recurringPaymentLoading,
    recurringPayment,
    refetchRecurringPayment,
    deleteRecurringPayment,
    isError,
    recurringPaymentError,
    onAddRecurringPayment,
  } = useRecurringPayment();

  return (
    <FullScreenView
      headerProps={{
        title: t(PaymentMethodsTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      refreshControl={
        <RefreshControl
          refreshing={recurringPaymentLoading}
          onRefresh={refetchRecurringPayment}
        />
      }
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(PaymentMethodsTexts.header.title)}
        />
      )}
    >
      <View style={styles.content}>
        {isError && (
          <View accessibilityLiveRegion="polite">
            <MessageInfoBox
              type="error"
              message={t(PaymentMethodsTexts.genericError)}
            />
          </View>
        )}
        {recurringPayment && recurringPayment.length > 0 && (
          <Section>
            {recurringPayment.map((card) => (
              <GenericSectionItem key={'card-' + card.id}>
                <Card
                  card={card}
                  removePaymentHandler={(card) =>
                    deleteRecurringPayment(card.id)
                  }
                />
              </GenericSectionItem>
            ))}
          </Section>
        )}
        {!recurringPaymentError &&
          !recurringPaymentLoading &&
          (!recurringPayment || recurringPayment?.length == 0) && (
            <NoCardsInfo />
          )}

        <Section>
          <LinkSectionItem
            text={t(PaymentMethodsTexts.addPaymentMethod)}
            onPress={onAddRecurringPayment}
            icon={<ThemeIcon svg={Add} />}
          />
        </Section>
        <MessageInfoBox
          message={t(PaymentMethodsTexts.vippsInfo)}
          type="info"
        />
      </View>
    </FullScreenView>
  );
};

const Card = (props: {
  card: RecurringPayment;
  removePaymentHandler: (card: RecurringPayment) => void;
}) => {
  const {card, removePaymentHandler} = props;
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
          <PressableOpacity
            accessibilityLabel={t(
              PaymentMethodsTexts.a11y.deleteCardIcon(
                paymentName,
                card.maskedPan,
              ),
            )}
            style={style.actionButton}
            onPress={() => {
              destructiveAlert({
                alertTitleString: t(PaymentMethodsTexts.deleteModal.title),
                alertMessageString: t(PaymentMethodsTexts.deleteModal.message),
                cancelAlertString: t(
                  PaymentMethodsTexts.deleteModal.cancelButton,
                ),
                confirmAlertString: t(
                  PaymentMethodsTexts.deleteModal.confirmButton,
                ),
                destructiveArrowFunction: () => removePaymentHandler(card),
              });
            }}
          >
            <ThemeText>
              {t(PaymentMethodsTexts.deleteModal.confirmButton)}
            </ThemeText>
            <SvgDelete
              height={21 * fontScale}
              width={21 * fontScale}
              fill={theme.color.foreground.dynamic.primary}
            />
          </PressableOpacity>
        </View>
      </View>

      <ExpiryMessage recurringPayment={card} />
    </View>
  );
};

const NoCardsInfo = () => {
  const {t} = useTranslation();
  return (
    <View accessibilityLiveRegion="polite">
      <MessageInfoBox
        type="info"
        message={t(PaymentMethodsTexts.noStoredCards)}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  content: {
    padding: theme.spacing.medium,
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
