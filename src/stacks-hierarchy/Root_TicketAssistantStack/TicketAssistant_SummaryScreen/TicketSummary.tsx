import {Dimensions, View} from 'react-native';
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
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_SummaryScreen/utils';

const interactiveColorName: InteractiveColor = 'interactive_2';
const themeColor_1: StaticColorByType<'background'> = 'background_accent_1';
export const TicketSummary = () => {
  const language = useTranslation();
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const {width} = Dimensions.get('window');
  const {theme} = useTheme();
  const interactiveColor = theme.interactive[interactiveColorName];
  let {response, purchaseDetails, data} = useTicketAssistantState();
  const {duration, frequency} = data;

  const index = getIndexOfLongestDurationTicket(response.tickets);

  const recommendedTicket =
    purchaseDetails?.purchaseTicketDetails[index].preassignedFareProduct;
  const recommendedTicketTypeConfig =
    purchaseDetails?.purchaseTicketDetails[index]?.fareProductTypeConfig;
  const fromTariffZone = purchaseDetails?.tariffZones[0];
  const toTariffZone = purchaseDetails?.tariffZones[1];
  const traveller = purchaseDetails?.userProfileWithCount[0];

  const savings = calculateSavings(
    response?.total_cost,
    calculateSingleTickets(duration, frequency) * response.single_ticket_price,
  );

  return (
    <>
      <View
        style={styles.ticketContainer}
        accessibilityLabel={t(
          TicketAssistantTexts.summary.ticketSummaryA11yLabel({
            ticket:
              language.language === 'nb'
                ? `${recommendedTicket?.name.value}`
                : `${recommendedTicket?.alternativeNames[0].value}`,
            traveller:
              language.language === 'nb'
                ? `${traveller?.name.value}`
                : `${traveller?.alternativeNames[0].value}`,
            fromTariffZone: fromTariffZone?.name.value || '',
            toTariffZone: toTariffZone?.name.value || '',
            price: response.tickets[index].price.toFixed(2),
            pricePerTrip: (
              response.tickets[index].price /
              ((response.tickets[index].duration / 7) * frequency)
            ).toFixed(2),
          }),
        )}
      >
        <View style={[styles.upperPart, {minWidth: width * 0.6}]}>
          <View style={styles.travelModeWrapper}>
            {recommendedTicketTypeConfig?.transportModes && (
              <TransportModes
                iconSize={'small'}
                modes={recommendedTicketTypeConfig?.transportModes}
                style={{flex: 2}}
              />
            )}
          </View>

          <View style={styles.productName} testID={'Title'}>
            <ThemeText
              type="body__secondary--bold"
              color={interactiveColor.default}
              accessibilityLabel={
                language.language === 'nb'
                  ? `${recommendedTicket?.name.value}`
                  : `${recommendedTicket?.alternativeNames[0].value}`
              }
            >
              {language.language === 'nb'
                ? `${recommendedTicket?.name.value}`
                : `${recommendedTicket?.alternativeNames[0].value}`}
            </ThemeText>
          </View>

          <View style={styles.horizontalFlex}>
            {/** Traveller **/}
            <View>
              <View>
                <ThemeText type="label__uppercase" color="secondary">
                  {t(TicketAssistantTexts.summary.traveller)}
                </ThemeText>
                <View>
                  {response && response.tickets[index].traveller && (
                    <View>
                      <View>
                        <InfoChip
                          interactiveColor={interactiveColorName}
                          style={styles.infoChip}
                          text={
                            language.language === 'nb'
                              ? `${traveller?.name.value}`
                              : `${traveller?.alternativeNames[0].value}`
                          }
                        />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
            {/** Zones **/}
            {response.zones &&
              response.zones.length > 0 &&
              fromTariffZone &&
              toTariffZone && (
                <View>
                  <ThemeText type="label__uppercase" color="secondary">
                    {t(TicketAssistantTexts.summary.zones)}
                  </ThemeText>
                  {response.zones[0] === response.zones[1] ? (
                    <InfoChip
                      interactiveColor={interactiveColorName}
                      style={styles.infoChip}
                      text={`${fromTariffZone.name?.value}`}
                    />
                  ) : (
                    <InfoChip
                      interactiveColor={interactiveColorName}
                      style={styles.infoChip}
                      text={`${fromTariffZone.name?.value} - ${toTariffZone.name?.value}`}
                    />
                  )}
                </View>
              )}
            {/** Total ticket cost **/}
            {response.tickets[0].price != 0 && (
              <View>
                <ThemeText type="label__uppercase" color="secondary">
                  {t(TicketAssistantTexts.summary.price)}
                </ThemeText>
                <InfoChip
                  interactiveColor={interactiveColorName}
                  style={styles.infoChip}
                  text={`${response.tickets[index].price.toFixed(2)} kr`}
                />
              </View>
            )}
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
            {response.tickets[index].duration
              ? `${(
                  response.tickets[index].price /
                  ((response.tickets[index].duration / 7) * frequency)
                ).toFixed(2)} kr`
              : `${response.tickets[index].price.toFixed(2)} kr`}
          </ThemeText>
        </View>
      </View>
      <ThemeText
        type={'body__secondary'}
        style={styles.savingsText}
        color={themeColor}
        accessibilityLabel={t(
          TicketAssistantTexts.summary.savingsA11yLabel({
            totalSavings: savings,
            perTripSavings: (savings / ((duration / 7) * frequency)).toFixed(2),
            alternative: `${calculateSingleTickets(duration, frequency)}`,
          }),
        )}
      >
        {recommendedTicket?.durationDays !== undefined
          ? t(
              TicketAssistantTexts.summary.savings({
                totalSavings: savings,
                perTripSavings: (
                  savings /
                  ((duration / 7) * frequency)
                ).toFixed(2),
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
