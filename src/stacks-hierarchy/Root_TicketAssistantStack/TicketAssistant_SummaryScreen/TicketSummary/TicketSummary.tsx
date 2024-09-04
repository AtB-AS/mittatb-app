import {View} from 'react-native';
import {TransportModes} from '@atb/components/transportation-modes';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import {getThemeColor} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {StyleSheet, useTheme} from '@atb/theme';
import React from 'react';

import {useTicketAssistantState} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {getReferenceDataName} from '@atb/configuration';
import {formatDecimalNumber} from '@atb/utils/numbers';
import {daysInWeek} from '@atb/utils/date';
import {BorderedInfoBox} from '@atb/components/bordered-info-box';
import { Theme } from '@atb-as/theme';

const getInteractiveColor = (theme: Theme) => theme.color.interactive[2];

export const TicketSummary = () => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  const {theme} = useTheme();
  const interactiveColor = getInteractiveColor(theme);
  const themeColor = getThemeColor(theme);

  const {recommendedTicketSummary, inputParams} = useTicketAssistantState();
  if (!recommendedTicketSummary) return null;
  const frequency = inputParams.frequency ?? 1;
  const ticket = recommendedTicketSummary.ticket;

  const recommendedTicketTypeConfig =
    recommendedTicketSummary.fareProductTypeConfig;
  const preassignedFareProduct =
    recommendedTicketSummary.preassignedFareProduct;

  const traveller = recommendedTicketSummary?.userProfileWithCount[0];

  const ticketName =
    getReferenceDataName(preassignedFareProduct, language) ?? '';
  const travellerName = getReferenceDataName(traveller, language);
  const [fromTariffZone, toTariffZone] =
    recommendedTicketSummary.tariffZones ?? [];

  const zonesString = `${fromTariffZone.name?.value}${
    fromTariffZone.name !== toTariffZone.name
      ? ` - ${toTariffZone.name?.value}`
      : ''
  }`;

  const inputDuration = inputParams.duration || 0;
  const effectiveDuration = Math.min(ticket.duration, inputDuration);

  const days = Math.min(inputDuration, daysInWeek);
  const numberOfTravels = Math.ceil(effectiveDuration * (frequency / days));

  const priceDiff =
    numberOfTravels * recommendedTicketSummary.singleTicketPrice - ticket.price;

  const ticketPriceString = `${formatDecimalNumber(
    ticket.price,
    language,
    2,
  )} kr`;

  const perTripPrice = ticket.duration
    ? ticket.price / numberOfTravels
    : ticket.price;

  const perTripPriceString =
    t(TicketAssistantTexts.summary.pricePerTrip) +
    ` ${formatDecimalNumber(perTripPrice, language, 2)} kr`;

  const transportModes = recommendedTicketTypeConfig.transportModes;

  let savingsText;

  if (ticket.duration !== 0) {
    if (priceDiff < 0) {
      savingsText = t(
        TicketAssistantTexts.summary.lossNotice({
          numberOfTickets: numberOfTravels.toString(),
          priceDiff: formatDecimalNumber(Math.abs(priceDiff), language, 2),
        }),
      );
    } else if (priceDiff === 0) {
      savingsText = t(TicketAssistantTexts.summary.equalPriceNotice);
    } else {
      savingsText = t(
        TicketAssistantTexts.summary.savings({
          totalSavings: formatDecimalNumber(priceDiff, language, 2),
          perTripSavings: formatDecimalNumber(
            recommendedTicketSummary.singleTicketPrice - perTripPrice,
            language,
            2,
          ),
          alternative: numberOfTravels.toString(),
        }),
      );
    }
  } else {
    savingsText = t(TicketAssistantTexts.summary.singleTicketNotice);
  }

  const perTripAndSavingsAccessibilityLabel = [
    perTripPriceString,
    savingsText,
  ].join(screenReaderPause);

  const a11ySummary = t(
    TicketAssistantTexts.summary.ticketSummaryA11yLabel({
      ticket: ticketName,
      traveller: travellerName,
      tariffZones: zonesString,
      price: ticketPriceString,
      pricePerTrip: perTripPriceString,
    }),
  );

  return (
    <>
      <View style={styles.ticketContainer} accessibilityLabel={a11ySummary}>
        <View style={styles.upperPart}>
          <View style={styles.travelModeWrapper}>
            <TransportModes
              iconSize="xSmall"
              modes={transportModes}
              style={styles.transportModes}
            />
          </View>

          <View style={styles.productName} testID="Title">
            <ThemeText
              type="body__secondary--bold"
              color={interactiveColor.default}
              accessibilityLabel={ticketName}
            >
              {ticketName}
            </ThemeText>
          </View>

          <View style={styles.horizontalFlex}>
            {/** Traveller **/}
            <View accessible={true}>
              <ThemeText type="label__uppercase" color="secondary">
                {t(TicketAssistantTexts.summary.traveller)}
              </ThemeText>
              <BorderedInfoBox
                backgroundColor={interactiveColor.default}
                type="small"
                style={styles.infoChip}
                text={travellerName}
              />
            </View>
            {/** Zones **/}
            <View accessible={true}>
              <ThemeText type="label__uppercase" color="secondary">
                {t(TicketAssistantTexts.summary.zones)}
              </ThemeText>
              <BorderedInfoBox
                backgroundColor={interactiveColor.default}
                type="small"
                style={styles.infoChip}
                text={zonesString}
              />
            </View>
          </View>
        </View>
        <View accessible={true} style={styles.ticketFooter}>
          <ThemeText type="body__secondary" color={interactiveColor.outline}>
            {t(TicketAssistantTexts.summary.price)}
          </ThemeText>
          <ThemeText
            type="body__secondary--bold"
            color={interactiveColor.outline}
          >
            {ticketPriceString}
          </ThemeText>
        </View>
      </View>
      <ThemeText
        type="body__secondary"
        style={styles.savingsText}
        color={themeColor}
        accessibilityLabel={perTripAndSavingsAccessibilityLabel}
      >
        {perTripPriceString}
        {'\n'}
        {savingsText}
      </ThemeText>
    </>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  ticketContainer: {
    marginHorizontal: theme.spacing.large,
    backgroundColor: getInteractiveColor(theme).default.background,
    borderRadius: theme.border.radius.medium,
    overflow: 'hidden',
  },
  transportModes: {
    flex: 2,
  },
  upperPart: {
    padding: theme.spacing.xLarge,
    flexGrow: 1,
    minWidth: '60%',
  },
  travelModeWrapper: {
    flexShrink: 1,
    marginBottom: theme.spacing.medium,
  },
  transportationIcon: {
    marginRight: theme.spacing.xSmall,
  },
  productName: {
    marginBottom: theme.spacing.medium,
  },
  horizontalFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: theme.spacing.large,
  },
  infoChip: {
    marginVertical: theme.spacing.xSmall,
  },
  infoChip_travellers: {
    marginRight: theme.spacing.xSmall,
  },
  additionalCategories: {
    marginHorizontal: theme.spacing.small,
    marginVertical: theme.spacing.xSmall,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xLarge,
    paddingVertical: theme.spacing.medium,
    backgroundColor: theme.color.background.accent[1].background,
  },
  savingsText: {
    textAlign: 'center',
    paddingVertical: theme.spacing.large,
  },
}));
