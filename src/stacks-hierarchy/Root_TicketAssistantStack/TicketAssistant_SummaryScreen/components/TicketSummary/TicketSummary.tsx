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
  getIndexOfLongestDurationTicket,
  perTripSavings,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_SummaryScreen/utils';
import {useTextForLanguage} from '@atb/translations/utils';
import {getReferenceDataName} from '@atb/reference-data/utils';

const interactiveColorName: InteractiveColor = 'interactive_2';
const themeColor_1: StaticColorByType<'background'> = 'background_accent_1';
export const TicketSummary = () => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  const {theme} = useTheme();
  const interactiveColor = theme.interactive[interactiveColorName];
  let {response, purchaseDetails, data} = useTicketAssistantState();
  const {tickets, zones, total_cost, single_ticket_price} = response;
  const {duration, frequency} = data;

  const index = getIndexOfLongestDurationTicket(tickets);
  const ticket = tickets[index];

  const recommendedTicketTypeConfig =
    purchaseDetails?.purchaseTicketDetails[index]?.fareProductTypeConfig;
  const traveller = purchaseDetails?.userProfileWithCount[0];

  const ticketName = useTextForLanguage(recommendedTicketTypeConfig.name) ?? '';
  const travellerName = getReferenceDataName(traveller, language);
  const [fromTariffZone, toTariffZone] = purchaseDetails?.tariffZones ?? [];

  const zonesString =
    zones[0] === zones[1]
      ? `${fromTariffZone.name?.value}`
      : `${fromTariffZone.name?.value} - ${toTariffZone.name?.value}`;

  const savings = calculateSavings(
    total_cost,
    calculateSingleTickets(duration, frequency) * single_ticket_price,
  );
  const ticketPrice = ticket.price;
  const perTripPrice = ticket.duration
    ? ticket.price
    : ticket.price / ((ticket.duration / 7) * frequency);

  const a11ySummary = t(
    TicketAssistantTexts.summary.ticketSummaryA11yLabel({
      ticket: ticketName,
      traveller: travellerName,
      fromTariffZone: fromTariffZone?.name.value || '',
      toTariffZone: toTariffZone?.name.value || '',
      price: ticket.price.toFixed(2),
      pricePerTrip: perTripPrice.toFixed(2),
    }),
  );

  return (
    <>
      <View style={styles.ticketContainer} accessibilityLabel={a11ySummary}>
        <View style={styles.upperPart}>
          {recommendedTicketTypeConfig?.transportModes && (
            <View style={styles.travelModeWrapper}>
              <TransportModes
                iconSize={'small'}
                modes={recommendedTicketTypeConfig?.transportModes}
                style={{flex: 2}}
              />
            </View>
          )}

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
                text={ticketPrice.toFixed(2) + 'kr'}
              />
            </View>
          </View>
        </View>
        <View style={styles.ticketFooter}>
          <ThemeText color={interactiveColor.outline}>
            {t(TicketAssistantTexts.summary.pricePerTrip)}
          </ThemeText>
          <ThemeText
            type="body__secondary--bold"
            color={interactiveColor.outline}
          >
            {perTripPrice.toFixed(2) + 'kr'}
          </ThemeText>
        </View>
      </View>
      <ThemeText
        type={'body__secondary'}
        style={styles.savingsText}
        color={themeColor}
        accessibilityLabel={t(
          TicketAssistantTexts.summary.savings({
            totalSavings: savings,
            perTripSavings: perTripSavings(savings, duration, frequency),
            alternative: `${calculateSingleTickets(duration, frequency)}`,
          }),
        )}
      >
        {ticket.duration !== undefined
          ? t(
              TicketAssistantTexts.summary.savings({
                totalSavings: savings,
                perTripSavings: perTripSavings(savings, duration, frequency),
                alternative: `${calculateSingleTickets(duration, frequency)}`,
              }),
            )
          : t(TicketAssistantTexts.summary.noticeLabel2)}
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
    paddingHorizontal: theme.spacings.xLarge,
    paddingVertical: theme.spacings.xLarge,
  },
}));
