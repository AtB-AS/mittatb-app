import React from 'react';
import {ScrollView, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useTranslation} from '@atb/translations';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Parking} from '@atb/assets/svg/mono-icons/places';
import {StyleSheet} from '@atb/theme';
import {ThemedStartCityBike} from '@atb/theme/ThemedAssets';
import {LinkSectionItem} from '@atb/components/sections';
import {ShmoBooking} from '@atb/api/types/mobility';
import {ShmoHelpParams} from '@atb/stacks-hierarchy';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

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

  return (
    <View style={styles.overlay}>
      <ScrollView
        contentContainerStyle={styles.contentWrapper}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.title}>
          <ThemeIcon size="large" svg={Parking} />
          {activeBooking.asset?.stationSlotName && (
            <ThemeText typography="heading__xl" style={styles.titleText}>
              {t(
                MobilityTexts.cityBike.location(
                  activeBooking.asset?.stationSlotName,
                ),
              )}
            </ThemeText>
          )}
        </View>
        <ThemedStartCityBike />
        <View style={styles.content}>
          <ThemeText typography="heading__xl" style={styles.contentText}>
            {t(MobilityTexts.cityBike.startTripView.title)}
          </ThemeText>

          <ThemeText style={styles.contentText}>
            {t(MobilityTexts.cityBike.startTripView.description)}
          </ThemeText>
          <ThemeText style={styles.contentText}>
            {t(MobilityTexts.cityBike.startTripView.safeTrip)}
          </ThemeText>
        </View>
      </ScrollView>
      <View style={styles.supportButton}>
        <LinkSectionItem
          text={t(MobilityTexts.helpText)}
          onPress={() => {
            navigateToSupport({
              bookingId: activeBooking.bookingId,
              operatorId: activeBooking.asset.operator.id,
              formFactor: FormFactor.Bicycle,
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
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 48,
  },
  title: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.small,
    width: '100%',
  },
  content: {
    alignItems: 'center',
    flexDirection: 'column',
    gap: theme.spacing.medium,
    padding: theme.spacing.large,
  },
  titleText: {
    flexShrink: 1,
    textAlign: 'center',
  },
  contentText: {
    textAlign: 'center',
  },
  supportButton: {
    width: '100%',
    marginTop: 'auto',
  },
}));
