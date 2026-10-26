import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {PaymentType, PreReservation} from '@atb/modules/ticketing';
import {TicketingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {WithValidityLine} from './components/WithValidityLine';
import {GenericSectionItem, Section} from '@atb/components/sections';

type Props = {
  preReservation: PreReservation;
  now: number;
};

export const PreReservationCard: React.FC<Props> = ({preReservation, now}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <Section>
      <GenericSectionItem style={styles.genericSectionItemOverrides}>
        <WithValidityLine preReservation={preReservation} now={now}>
          <ThemeText typography="heading__l">
            {t(TicketingTexts.reservation.preReservation)}
          </ThemeText>
        </WithValidityLine>
      </GenericSectionItem>
      <GenericSectionItem accessibility={{accessible: true}}>
        <View style={styles.detailTexts}>
          {preReservation.paymentType && (
            <ThemeText typography="body__s" type="secondary">
              {t(
                TicketingTexts.reservation.paymentMethod(
                  PaymentType[preReservation.paymentType],
                ),
              )}
            </ThemeText>
          )}
          <ThemeText>
            {t(TicketingTexts.reservation.orderId(preReservation.orderId))}
          </ThemeText>
        </View>
      </GenericSectionItem>
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  genericSectionItemOverrides: {
    paddingVertical: 0,
    borderWidth: 0,
  },
  detailTexts: {
    flex: 1,
    gap: theme.spacing.small,
  },
}));
