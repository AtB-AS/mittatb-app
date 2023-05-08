import {View} from 'react-native';
import {TransportModes} from '@atb/components/transportation-modes';
import {ThemeText} from '@atb/components/text';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import {InfoChip} from '@atb/components/info-chip';
import {themeColor} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {StyleSheet, useTheme} from '@atb/theme';
import React from 'react';
import {InteractiveColor, StaticColorByType} from '@atb/theme/colors';

import {useTicketAssistantState} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {
  calculateSavings,
  calculateSingleTickets,
  perTripSavings,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_SummaryScreen/TicketSummary/utils';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {daysInWeek} from 'date-fns';
import {formatDecimalNumber} from '@atb/utils/numbers';

const interactiveColorName: InteractiveColor = 'interactive_2';
const themeColor_1: StaticColorByType<'background'> = 'background_accent_1';
export const TicketSummary = () => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  const {theme} = useTheme();
  const interactiveColor = theme.interactive[interactiveColorName];

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

  const savings = calculateSavings(
    ticket.price,
    calculateSingleTickets(ticket.duration, frequency) *
      recommendedTicketSummary.singleTicketPrice,
  );

  const ticketPriceString = `${formatDecimalNumber(ticket.price, language)} kr`;

  const perTripPrice = ticket.duration
    ? ticket.price / ((ticket.duration / daysInWeek) * frequency)
    : ticket.price;

  const perTripPriceString = `${formatDecimalNumber(
    perTripPrice,
    language,
  )} kr`;

  const transportModes = recommendedTicketTypeConfig.transportModes;

  // If the ticket duration is longer than the input duration,
  // we want to calculate based on the input duration instead
  const inputDuration = inputParams.duration ?? 0;
  const comparedDuration =
    ticket.duration > inputDuration ? inputDuration : ticket.duration;

  const savingsText = t(
    ticket.duration !== 0
      ? savings === 0
        ? TicketAssistantTexts.summary.equalPriceNotice
        : TicketAssistantTexts.summary.savings({
            totalSavings: savings,
            perTripSavings: formatDecimalNumber(
              perTripSavings(savings, ticket.duration, frequency),
              language,
            ),
            alternative: `${calculateSingleTickets(
              comparedDuration,
              frequency,
            )}`,
          })
      : TicketAssistantTexts.summary.singleTicketNotice,
  );

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
              iconSize={'small'}
              modes={transportModes}
              style={styles.transportModes}
            />
          </View>

          <View style={styles.productName} testID={'Title'}>
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
            <View>
              <ThemeText type="label__uppercase" color="secondary">
                {t(TicketAssistantTexts.summary.traveller)}
              </ThemeText>
              <InfoChip
                interactiveColor={interactiveColorName}
                style={styles.infoChip}
                text={travellerName}
              />
            </View>
            {/** Zones **/}
            <View>
              <ThemeText type="label__uppercase" color="secondary">
                {t(TicketAssistantTexts.summary.zones)}
              </ThemeText>
              <InfoChip
                interactiveColor={interactiveColorName}
                style={styles.infoChip}
                text={zonesString}
              />
            </View>
            {/** Total ticket cost **/}
            <View>
              <ThemeText type="label__uppercase" color="secondary">
                {t(TicketAssistantTexts.summary.price)}
              </ThemeText>
              <InfoChip
                interactiveColor={interactiveColorName}
                style={styles.infoChip}
                text={ticketPriceString}
              />
            </View>
          </View>
        </View>
        <View style={styles.ticketFooter}>
          <ThemeText type={'body__secondary'} color={interactiveColor.outline}>
            {t(TicketAssistantTexts.summary.pricePerTrip)}
          </ThemeText>
          <ThemeText
            type="body__secondary--bold"
            color={interactiveColor.outline}
          >
            {perTripPriceString}
          </ThemeText>
        </View>
      </View>
      <ThemeText
        type={'body__secondary'}
        style={styles.savingsText}
        color={themeColor}
        accessibilityLabel={savingsText}
      >
        {savingsText}
      </ThemeText>
    </>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  ticketContainer: {
    marginHorizontal: theme.spacings.large,
    backgroundColor: theme.interactive[interactiveColorName].default.background,
    borderRadius: theme.border.radius.regular,
    overflow: 'hidden',
  },
  transportModes: {
    flex: 2,
  },
  upperPart: {
    padding: theme.spacings.xLarge,
    flexGrow: 1,
    minWidth: '60%',
  },
  travelModeWrapper: {
    flexShrink: 1,
    marginBottom: theme.spacings.medium,
  },
  transportationIcon: {
    marginRight: theme.spacings.xSmall,
  },
  productName: {
    marginBottom: theme.spacings.medium,
  },
  horizontalFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoChip: {
    marginVertical: theme.spacings.xSmall,
  },
  infoChip_travellers: {
    marginRight: theme.spacings.xSmall,
  },
  additionalCategories: {
    marginHorizontal: theme.spacings.small,
    marginVertical: theme.spacings.xSmall,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacings.xLarge,
    paddingVertical: theme.spacings.medium,
    backgroundColor: theme.static.background[themeColor_1].background,
  },
  savingsText: {
    textAlign: 'center',
    paddingVertical: theme.spacings.large,
  },
}));
