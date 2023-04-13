import {ScrollView} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {themeColor} from '@atb/stacks-hierarchy/Root_OnboardingStack/Onboarding_WelcomeScreen';
import React, {useContext, useEffect, useState} from 'react';
import {
  TicketAssistant_ZonePickerScreenParams,
  TicketAssistantScreenProps,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import {View} from 'react-native';
import {Button} from '@atb/components/button';
import {
  TariffZonesTexts,
  TicketAssistantTexts,
  useTranslation,
} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import {TariffZoneSelection} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByMapScreen';
import {
  TariffZonesSelectorButtons,
  TariffZonesSelectorMap,
} from '@atb/tariff-zones-selector';
import {useOfferDefaults} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/use-offer-defaults';
import {useFirestoreConfiguration} from '@atb/configuration';
import TicketAssistantContext from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {getRecommendedTicket} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/api';

type Props = TicketAssistantScreenProps<'TicketAssistant_ZonePickerScreen'>;
export const TicketAssistant_ZonePickerScreen = ({
  navigation,
  route,
}: Props) => {
  const styles = useThemeStyles();
  const {fareProductTypeConfigs} = useFirestoreConfiguration();
  const offerDefaults = useOfferDefaults(
    undefined,
    fareProductTypeConfigs[0].type,
  );
  const {t} = useTranslation();

  const isApplicableOnSingleZoneOnly = false;

  let {fromTariffZone, toTariffZone} = route.params ?? offerDefaults;
  fromTariffZone = fromTariffZone || offerDefaults.fromTariffZone;
  toTariffZone = toTariffZone || offerDefaults.toTariffZone;

  const [selectedZones, setSelectedZones] = useState<TariffZoneSelection>({
    from: fromTariffZone,
    to: toTariffZone,
    selectNext: isApplicableOnSingleZoneOnly ? 'from' : 'to',
  });
  const contextValue = useContext(TicketAssistantContext);
  if (!contextValue) throw new Error('Context is undefined!');

  const {data, updateData, setResponse, setLoading} = contextValue;

  useEffect(() => {
    const zoneIds = [selectedZones.from.id, selectedZones.to.id];
    const newData = {...data, zones: zoneIds};
    updateData(newData);
  }, [selectedZones]);

  useEffect(() => {
    setSelectedZones({
      ...selectedZones,
      from: fromTariffZone,
    });
  }, [fromTariffZone]);

  useEffect(() => {
    setSelectedZones({
      ...selectedZones,
      to: toTariffZone,
    });
  }, [toTariffZone]);

  const onVenueSearchClick = (
    callerRouteParam: keyof TicketAssistant_ZonePickerScreenParams,
  ) => {
    navigation.navigate({
      name: 'Root_PurchaseTariffZonesSearchByTextScreen',
      params: {
        label:
          callerRouteParam === 'fromTariffZone'
            ? t(TariffZonesTexts.location.zonePicker.labelFrom)
            : t(TariffZonesTexts.location.zonePicker.labelTo),
        callerRouteName: route.name,
        callerRouteParam,
      },
      merge: true,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ThemeText
          type={'body__primary--jumbo--bold'}
          style={styles.header}
          color={themeColor}
          accessibilityLabel={t(TicketAssistantTexts.welcome.titleA11yLabel)}
        >
          {t(TicketAssistantTexts.zonesSelector.title)}
        </ThemeText>
        <View style={styles.mapContainer}>
          <View style={styles.zonesSelectorButtonsContainer}>
            <TariffZonesSelectorButtons
              selectedZones={selectedZones}
              isApplicableOnSingleZoneOnly={isApplicableOnSingleZoneOnly}
              onVenueSearchClick={onVenueSearchClick}
            />
          </View>

          <TariffZonesSelectorMap
            isApplicableOnSingleZoneOnly={isApplicableOnSingleZoneOnly}
            selectedZones={selectedZones}
            setSelectedZones={setSelectedZones}
          />
        </View>
        <View style={styles.bottomView}>
          <Button
            interactiveColor="interactive_0"
            onPress={async () => {
              navigation.navigate('TicketAssistant_SummaryScreen');
              if (setLoading) {
                setLoading(true);
              }
              await getRecommendedTicket(data)
                .then((r) => {
                  if (setResponse && r) {
                    setResponse(r);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
              if (setLoading) {
                setLoading(false);
              }
            }}
            text={t(TicketAssistantTexts.frequency.mainButton)}
            testID="nextButton"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.xLarge,
  },
  zonesSelectorButtonsContainer: {
    marginBottom: theme.spacings.medium,
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: theme.spacings.xLarge,
    marginVertical: theme.spacings.medium,
  },
  contentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
  },
  bottomView: {
    paddingHorizontal: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge,
  },
  loadingGif: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: theme.spacings.large,
  },
}));
