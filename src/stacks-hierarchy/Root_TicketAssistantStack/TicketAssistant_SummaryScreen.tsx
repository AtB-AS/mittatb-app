import {Dimensions, ScrollView, TouchableOpacity, View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {InteractiveColor} from '@atb/theme/colors';
import {TransportModes} from '@atb/components/transportation-modes';
import {ThemeText} from '@atb/components/text';
import {InfoChip} from '@atb/components/info-chip';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import React, {useContext} from 'react';
import TicketAssistantContext from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {themeColor} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';

const interactiveColorName: InteractiveColor = 'interactive_2';
export const TicketAssistant_SummaryScreen = () => {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const {width} = Dimensions.get('window');
  const {theme} = useTheme();

  const contextValue = useContext(TicketAssistantContext);

  if (!contextValue) throw new Error('Context is undefined!');

  let {response, data} = contextValue;
  if (response?.tickets == undefined) {
    response = {
      totalCost: 0,
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
  console.log('response', response);
  const startDate = new Date();
  const endDate: string = new Date(
    startDate.getTime() + data.duration * 24 * 60 * 60 * 1000,
  ).toLocaleDateString('nb-NO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const interactiveColor = theme.interactive[interactiveColorName];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
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
        type={'body__secondary'}
        style={styles.description}
      >
        {t(
          TicketAssistantTexts.summary.description({
            frequency: data.frequency,
            date: endDate,
          }),
        )}
      </ThemeText>
      {response != null && response.tickets.length > 0 && (
        <TouchableOpacity
          style={styles.ticketContainer}
          accessible={true}
          onPress={() => console.log('Pressed')}
          accessibilityLabel="Repeat purchase"
          accessibilityHint="Repeat purchase"
        >
          <View style={[styles.upperPart, {minWidth: width * 0.6}]}>
            <View style={styles.travelModeWrapper}>
              <TransportModes iconSize={'small'} modes={[]} style={{flex: 2}} />
            </View>

            <View style={styles.productName} testID={'Title'}>
              <ThemeText
                type="body__secondary--bold"
                color={interactiveColor.default}
              >
                HELLO
              </ThemeText>
            </View>

            <View style={styles.horizontalFlex}>
              <View>
                <View>
                  <ThemeText type="label__uppercase" color="secondary">
                    {response.tickets[0].traveller.user_type === 'ADULT'
                      ? 'Alder'
                      : 'Barn'}
                  </ThemeText>
                  <View style={styles.travellersTileWrapper}>
                    {response && (
                      <>
                        <View style={styles.additionalCategories}>
                          <ThemeText
                            type="body__tertiary"
                            color={interactiveColor.default}
                          >
                            HELLO
                          </ThemeText>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </View>
              {response.zones && response.zones.length > 0 && (
                <View>
                  <ThemeText type="label__uppercase" color="secondary">
                    {response.zones[0]}
                  </ThemeText>
                  {response.zones[0] === response.zones[1] ? (
                    <InfoChip
                      interactiveColor={interactiveColorName}
                      style={styles.infoChip}
                      text={`${response.zones[0]}`}
                    />
                  ) : (
                    <InfoChip
                      interactiveColor={interactiveColorName}
                      style={styles.infoChip}
                      text={`${response.zones[0]} - ${response.zones[1]}`}
                    />
                  )}
                </View>
              )}
            </View>
          </View>
          <View
            style={[
              styles.buyButton,
              {backgroundColor: interactiveColor.outline.background},
            ]}
          >
            <ThemeText color={interactiveColor.outline}>HELLO</ThemeText>
            <ThemeIcon svg={ArrowRight} fill={interactiveColor.outline.text} />
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};
const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  contentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
    width: '100%',
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
    marginHorizontal: theme.spacings.small,
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
  travellersTileWrapper: {
    display: 'flex',
    flexDirection: 'column',
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
  buyButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacings.xLarge,
    paddingVertical: theme.spacings.medium,
  },
}));
