import {ScrollView, View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';

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
import {useDefaultTariffZone} from '../utils';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {TICKET_ASSISTANT_SUMMARY_SCREEN} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/Root_TicketAssistantStack';
import {
  getThemeColor,
  getInteractiveColor,
} from './TicketAssistant_WelcomeScreen';

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
  const {theme} = useTheme();
  const themeColor = getThemeColor(theme);
  const interactiveColor = getInteractiveColor(theme);

  const isApplicableOnSingleZoneOnly = false;

  const fromTariffZone = defaultTariffZone;
  const toTariffZone = defaultTariffZone;

  const [selectedZones, setSelectedZones] = useState<TariffZoneSelection>({
    from: fromTariffZone,
    to: toTariffZone,
    selectNext: isApplicableOnSingleZoneOnly ? 'from' : 'to',
  });

  const {updateInputParams} = useTicketAssistantState();

  useEffect(() => {
    setSelectedZones((currentSelectedZones) => ({
      ...currentSelectedZones,
      from: fromTariffZone,
      to: toTariffZone,
    }));
  }, [fromTariffZone, toTariffZone]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      const zoneIds = [selectedZones.from.id, selectedZones.to.id];
      updateInputParams({zones: zoneIds});
    });

    return () => unsubscribe();
  }, [
    navigation,
    selectedZones.from.id,
    selectedZones.to.id,
    updateInputParams,
  ]);

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
            type="heading--big"
            style={styles.header}
            color={themeColor}
            accessibilityRole="header"
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
            interactiveColor={interactiveColor}
            onPress={() => {
              navigation.navigate(TICKET_ASSISTANT_SUMMARY_SCREEN);
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
    paddingHorizontal: theme.spacing.xLarge,
  },
  zonesSelectorButtonsContainer: {
    marginBottom: theme.spacing.medium,
  },
  zonesSelectorMapContainer: {
    flexGrow: 1,
    borderRadius: theme.border.radius.regular,
    overflow: 'hidden',
  },
  zonesSelectorContainer: {
    flex: 1,
    marginHorizontal: theme.spacing.xLarge,
    marginVertical: theme.spacing.medium,
  },
  contentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: getThemeColor(theme).background,
  },
  bottomView: {
    paddingHorizontal: theme.spacing.xLarge,
    paddingBottom: theme.spacing.xLarge,
  },
  loadingGif: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: theme.spacing.large,
  },
}));
