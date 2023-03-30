import {ScrollView} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {themeColor} from '@atb/stacks-hierarchy/Root_OnboardingStack/Onboarding_WelcomeScreen';
import React, {useState} from 'react';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import {View} from 'react-native';
import {Button} from '@atb/components/button';
import {
  TariffZonesTexts,
  TicketAssistantTexts,
  useTranslation,
} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import {
  TariffZoneSelection,
  TariffZoneWithMetadata,
} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByMapScreen';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {Root_PurchaseTariffZonesSearchByMapScreenParams} from '@atb/stacks-hierarchy/navigation-types';
import {ZonesMapSelectorComponent} from '@atb/zones-selectors/zones-selector-map/ZonesMapSelectorComponent';
import {ZonesSelectorButtonsComponent} from '@atb/zones-selectors/zones-selector-buttons/ZonesSelectorButtonsComponent';

type ZoneSelectorScreenProps =
  TicketAssistantScreenProps<'TicketAssistant_ZonePickerScreen'>;
export const TicketAssistant_ZonePickerScreen = ({
  navigation,
  route,
}: ZoneSelectorScreenProps) => {
  const styles = useThemeStyles();

  const {t} = useTranslation();

  const {tariffZones} = useFirestoreConfiguration();

  const fromTariffZone: TariffZoneWithMetadata = {
    id: tariffZones[0].id,
    name: tariffZones[0].name,
    version: tariffZones[0].version,
    geometry: tariffZones[0].geometry,
    resultType: 'zone',
  };

  const toTariffZone: TariffZoneWithMetadata = {
    id: tariffZones[0].id,
    name: tariffZones[0].name,
    version: tariffZones[0].version,
    geometry: tariffZones[0].geometry,
    resultType: 'zone',
  };

  const isApplicableOnSingleZoneOnly = false;

  const [selectedZones, setSelectedZones] = useState<TariffZoneSelection>({
    from: fromTariffZone,
    to: toTariffZone,
    selectNext: isApplicableOnSingleZoneOnly ? 'from' : 'to',
  });
  const onVenueSearchClick = (
    callerRouteParam: keyof Root_PurchaseTariffZonesSearchByMapScreenParams,
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

  // @ts-ignore
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
          <ZonesSelectorButtonsComponent
            fromTariffZone={selectedZones.from}
            toTariffZone={selectedZones.to}
            isApplicableOnSingleZoneOnly={false}
            onVenueSearchClick={onVenueSearchClick}
          />
          <ZonesMapSelectorComponent
            selectedZones={selectedZones}
            isApplicableOnSingleZoneOnly={isApplicableOnSingleZoneOnly}
            setSelectedZones={setSelectedZones}
          />
        </View>
        <View style={styles.bottomView}>
          <Button
            interactiveColor="interactive_0"
            onPress={() =>
              navigation.navigate('TicketAssistant_CategoryPickerScreen')
            }
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
}));
