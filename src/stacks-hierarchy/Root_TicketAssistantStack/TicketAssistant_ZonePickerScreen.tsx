import {ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {themeColor} from '@atb/stacks-hierarchy/Root_OnboardingStack/Onboarding_WelcomeScreen';
import React, {useEffect, useState} from 'react';
import {
  TicketAssistant_ZonePickerScreenParams,
  TicketAssistantScreenProps,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import {Button} from '@atb/components/button';
import {
  TariffZonesTexts,
  TicketAssistantTexts,
  useTranslation,
} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import {
  TariffZoneSelection,
  TariffZonesSelectorButtons,
  TariffZonesSelectorMap,
} from '@atb/tariff-zones-selector';
import {useFirestoreConfiguration} from '@atb/configuration';
import {useTicketAssistantState} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {useAccessibilityContext} from '@atb/AccessibilityContext';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useDefaultTariffZone} from '@atb/stacks-hierarchy/utils';

type Props = TicketAssistantScreenProps<'TicketAssistant_ZonePickerScreen'>;
export const TicketAssistant_ZonePickerScreen = ({
  navigation,
  route,
}: Props) => {
  const styles = useThemeStyles();
  const {tariffZones} = useFirestoreConfiguration();
  const a11yContext = useAccessibilityContext();
  const focusRef = useFocusOnLoad();

  const defaultTariffZone = useDefaultTariffZone(tariffZones);

  const {t} = useTranslation();

  const isApplicableOnSingleZoneOnly = false;

  const fromTariffZone = route.params?.fromTariffZone ?? defaultTariffZone;
  const toTariffZone = route.params?.toTariffZone ?? defaultTariffZone;
  const [selectedZones, setSelectedZones] = useState<TariffZoneSelection>({
    from: fromTariffZone,
    to: toTariffZone,
    selectNext: isApplicableOnSingleZoneOnly ? 'from' : 'to',
  });

  const {updateInputParams} = useTicketAssistantState();

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

  const unsubscribe = navigation.addListener('blur', () => {
    const zoneIds = [selectedZones.from.id, selectedZones.to.id];
    updateInputParams({zones: zoneIds});
  });

  useEffect(() => {
    return unsubscribe;
  }, [navigation]);

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
        <View ref={focusRef} accessible={true}>
          <ThemeText
            type={'heading--big'}
            style={styles.header}
            color={themeColor}
            accessibilityRole={'header'}
            accessibilityLabel={t(
              TicketAssistantTexts.zonesSelector.titleA11yLabel,
            )}
          >
            {t(TicketAssistantTexts.zonesSelector.title)}
          </ThemeText>
        </View>
        <View style={styles.zonesSelectorContainer}>
          <View style={styles.zonesSelectorButtonsContainer}>
            <TariffZonesSelectorButtons
              selectedZones={selectedZones}
              isApplicableOnSingleZoneOnly={isApplicableOnSingleZoneOnly}
              onVenueSearchClick={onVenueSearchClick}
            />
          </View>

          {!a11yContext.isScreenReaderEnabled && (
            <View style={styles.zonesSelectorMapContainer}>
              <TariffZonesSelectorMap
                isApplicableOnSingleZoneOnly={isApplicableOnSingleZoneOnly}
                selectedZones={selectedZones}
                setSelectedZones={setSelectedZones}
              />
            </View>
          )}
        </View>
        <View style={styles.bottomView}>
          <Button
            interactiveColor="interactive_0"
            onPress={() => {
              navigation.navigate('TicketAssistant_SummaryScreen');
            }}
            text={t(TicketAssistantTexts.frequency.mainButton)}
            testID="nextButton"
            accessibilityHint={t(
              TicketAssistantTexts.zonesSelector.a11yNextHint,
            )}
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
  zonesSelectorMapContainer: {
    flexGrow: 1,
    borderRadius: theme.border.radius.regular,
    overflow: 'hidden',
  },
  zonesSelectorContainer: {
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
