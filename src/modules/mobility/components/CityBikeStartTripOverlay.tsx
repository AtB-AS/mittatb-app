import React from 'react';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useTranslation} from '@atb/translations';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Parking} from '@atb/assets/svg/mono-icons/places';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemedCityBike} from '@atb/theme/ThemedAssets';
import {LinkSectionItem} from '@atb/components/sections';
import {ShmoBooking} from '@atb/api/types/mobility';
import {ShmoHelpParams} from '@atb/stacks-hierarchy';

type Props = {
  activeBooking: ShmoBooking;
  navigateToSupport: (params: ShmoHelpParams) => void;
};

export const CityBikeStartTripOverlay = ({
  activeBooking,
  navigateToSupport,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();

  return (
    <View style={styles.overlay}>
      <View style={styles.contentWrapper}>
        <View style={styles.title}>
          <ThemeIcon size="large" svg={Parking} />
          <ThemeText style={theme.typography.heading__xl}>
            {t(MobilityTexts.cityBike.location(1))}
          </ThemeText>
        </View>
        <ThemedCityBike />
        <View style={styles.content}>
          <ThemeText style={theme.typography.heading__xl}>
            {t(MobilityTexts.cityBike.startTripView.title)}
          </ThemeText>

          <ThemeText style={styles.contentText}>
            {t(MobilityTexts.cityBike.startTripView.description)}
          </ThemeText>
          <ThemeText style={styles.contentText}>
            {t(MobilityTexts.cityBike.startTripView.safeTrip)}
          </ThemeText>
        </View>
      </View>
      <View style={styles.supportButton}>
        <LinkSectionItem
          text={t(MobilityTexts.helpText)}
          onPress={() => {
            navigateToSupport({
              bookingId: activeBooking.bookingId,
              operatorId: activeBooking.asset.operator.id,
            });
          }}
          radius="top-bottom"
        />
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.color.background.neutral[1].background,
    paddingHorizontal: theme.spacing.xLarge,
    paddingBottom: theme.spacing.xLarge,
    zIndex: 100,
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 48,
  },
  title: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.small,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'column',
    gap: theme.spacing.medium,
    padding: theme.spacing.large,
  },
  contentText: {
    textAlign: 'center',
  },
  supportButton: {
    width: '100%',
    marginTop: 'auto',
  },
}));
