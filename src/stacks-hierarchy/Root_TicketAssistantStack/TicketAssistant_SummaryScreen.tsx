import {Dimensions, ScrollView, View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {InteractiveColor, StaticColorByType} from '@atb/theme/colors';
import {TransportModes} from '@atb/components/transportation-modes';
import {ThemeText} from '@atb/components/text';
import {InfoChip} from '@atb/components/info-chip';
import React, {useContext} from 'react';
import TicketAssistantContext from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {themeColor} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import {DashboardBackground} from '@atb/assets/svg/color/images';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import {FareProductTypeConfig} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/utils';
import {productIsSellableInApp} from '@atb/reference-data/utils';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';

type SummaryProps = TicketAssistantScreenProps<'TicketAssistant_SummaryScreen'>;

function isOfFareProductRef(a: any): a is {fareProductRef: string} {
  return 'fareProductRef' in a;
}

const interactiveColorName: InteractiveColor = 'interactive_2';
const themeColor_1: StaticColorByType<'background'> = 'background_accent_1';
export const TicketAssistant_SummaryScreen = ({navigation}: SummaryProps) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const {width} = Dimensions.get('window');
  const {theme} = useTheme();

  const contextValue = useContext(TicketAssistantContext);

  if (!contextValue) throw new Error('Context is undefined!');

  let {response, data} = contextValue;
  if (response?.tickets == undefined) {
    response = {
      totalCost: 800,
      zones: ['ATB:TariffZone:1', 'ATB:TariffZone:2'],
      tickets: [
        {
          product_id: 'ATB:Product:1',
          duration: 10,
          quantity: 2,
          price: 400,
          traveller: {id: 'ADULT', user_type: 'ADULT'},
        },
      ],
    };
  }
  const {preassignedFareProducts, fareProductTypeConfigs} =
    useFirestoreConfiguration();
  const sellableProductsInApp = preassignedFareProducts.filter(
    productIsSellableInApp,
  );
  const sellableFareProductTypeConfigs = fareProductTypeConfigs.filter(
    (config) => sellableProductsInApp.some((p) => p.type === config.type),
  );
  const groupedConfigs = sellableFareProductTypeConfigs.reduce<
    [FareProductTypeConfig, FareProductTypeConfig | undefined][]
  >((grouped, current, index, arr) => {
    if (index % 2 === 0) return [...grouped, [current, arr[index + 1]]];
    return grouped;
  }, []);

  const startDate = new Date();
  const endDate: string = new Date(
    startDate.getTime() + data.duration * 24 * 60 * 60 * 1000,
  ).toLocaleDateString('nb-NO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const savings = calculateSavings(response.totalCost, data.duration);

  const interactiveColor = theme.interactive[interactiveColorName];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.backdrop}>
        <DashboardBackground
          width={'100%'}
          height={'100%'}
          fill={'#AAE6EC'}
          fillOpacity={1}
        />
      </View>
      <View style={styles.mainView}>
        <ThemeText
          type={'body__primary--jumbo--bold'}
          style={styles.header}
          color={themeColor}
          accessibilityLabel={t(TicketAssistantTexts.welcome.titleA11yLabel)}
        >
          {t(TicketAssistantTexts.summary.title)}
        </ThemeText>
        <ThemeText
          color={themeColor}
          type={'body__primary'}
          style={styles.description}
        >
          {t(
            TicketAssistantTexts.summary.description({
              frequency: data.frequency,
              date: endDate,
            }),
          )}
        </ThemeText>
        {response.tickets.length > 0 && (
          <>
            <View style={styles.ticketContainer}>
              <View style={[styles.upperPart, {minWidth: width * 0.6}]}>
                <View style={styles.travelModeWrapper}>
                  <TransportModes
                    iconSize={'small'}
                    modes={groupedConfigs[0][0].transportModes}
                    style={{flex: 2}}
                  />
                </View>

                <View style={styles.productName} testID={'Title'}>
                  <ThemeText
                    type="body__secondary--bold"
                    color={interactiveColor.default}
                  >
                    {`${groupedConfigs[0][0].name[0].value}`}
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
                        {response && (
                          <>
                            <View>
                              <InfoChip
                                interactiveColor={interactiveColorName}
                                style={styles.infoChip}
                                text={`${response.tickets[0].traveller.user_type}`}
                              />
                            </View>
                          </>
                        )}
                      </View>
                    </View>
                  </View>
                  {/** Zones **/}
                  {response.zones && response.zones.length > 0 && (
                    <View>
                      <ThemeText type="label__uppercase" color="secondary">
                        {t(TicketAssistantTexts.summary.zones)}
                      </ThemeText>
                      {response.zones[0] === response.zones[1] ? (
                        <InfoChip
                          interactiveColor={interactiveColorName}
                          style={styles.infoChip}
                          text={`${response.zones[0].split(':')[2]}`}
                        />
                      ) : (
                        <InfoChip
                          interactiveColor={interactiveColorName}
                          style={styles.infoChip}
                          text={`${response.zones[0].split(':')[2]} - ${
                            response.zones[1].split(':')[2]
                          }`}
                        />
                      )}
                    </View>
                  )}
                  {/** Total ticket cost **/}
                  {response.totalCost != 0 && (
                    <View>
                      <ThemeText type="label__uppercase" color="secondary">
                        {t(TicketAssistantTexts.summary.price)}
                      </ThemeText>
                      <InfoChip
                        interactiveColor={interactiveColorName}
                        style={styles.infoChip}
                        text={`${response.totalCost} kr`}
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
                  {`${(
                    response.tickets[0].price / response.tickets[0].duration
                  ).toFixed(2)} kr`}
                </ThemeText>
              </View>
            </View>
            <ThemeText
              type={'body__secondary'}
              style={styles.savingsText}
              color={themeColor}
              accessibilityLabel={t(
                TicketAssistantTexts.welcome.titleA11yLabel,
              )}
            >
              {t(
                TicketAssistantTexts.summary.savings({
                  totalSavings: savings,
                  perTripSavings: (savings / data.duration).toFixed(2),
                  alternative: '200 enkeltbilletter',
                }),
              )}
            </ThemeText>
            <Button
              interactiveColor="interactive_0"
              onPress={() => {
                {
                  /** Navigate to PurchaseConfirmationScreen **/
                }
                console.log('Pressed');
              }}
              text={t(TicketAssistantTexts.summary.buyButton)}
              testID="nextButton"
            />
          </>
        )}
      </View>
    </ScrollView>
  );
};

function calculateSavings(
  ticketPrice: number,
  alternativePrice: number,
): number {
  return ticketPrice - alternativePrice;
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  contentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
    width: '100%',
  },
  mainView: {
    flex: 1,
    paddingHorizontal: theme.spacings.large,
    paddingBottom: theme.spacings.xLarge,
    width: '100%',
  },
  bottomView: {
    paddingHorizontal: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge,
  },
  header: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.xLarge,
    paddingVertical: theme.spacings.xLarge,
  },
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
  backdrop: {
    position: 'absolute',
    height: 250,
    left: 0,
    right: 0,
    top: 70,
    padding: 0,
    margin: 0,
  },
}));
