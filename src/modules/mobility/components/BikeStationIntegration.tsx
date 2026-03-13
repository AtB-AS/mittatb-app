import React from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {View} from 'react-native';
import {BikeStationFragment} from '@atb/api/types/generated/fragments/stations';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {TransportationIconBox} from '@atb/components/icon-box';
import {
  FormFactor,
  PropulsionType,
} from '@atb/api/types/generated/mobility-types_v2';
import SvgParking from '@atb/assets/svg/mono-icons/places/Parking';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ShmoHelpParams} from '@atb/stacks-hierarchy';

type Props = {
  station: BikeStationFragment | undefined;
  navigateSupportCallback: (params: ShmoHelpParams) => void;
  onPressVehicleType: (vehicleId: PropulsionType) => void;
};

export const BikeStationIntegration = ({
  station,
  navigateSupportCallback,
  onPressVehicleType,
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Section>
        {station?.vehicleTypesAvailable?.map((e, index) => (
          <LinkSectionItem
            key={index}
            text={t(
              MobilityTexts.bikeNameByPropulsionType(
                e.vehicleType.propulsionType,
              ),
            )}
            subtitle={t(MobilityTexts.freeBikes(e.count.toString()))}
            leftElement={
              <TransportationIconBox
                mode="bicycle"
                subMode={
                  e.vehicleType.propulsionType === PropulsionType.ElectricAssist
                    ? 'ebicycle'
                    : undefined
                }
                isFlexible={false}
                size="normal"
                type="compact"
                overrideBorderRadius="50%"
              />
            }
            onPress={() => onPressVehicleType(e.vehicleType.propulsionType)}
            disabled={e.count === 0}
          />
        ))}
      </Section>
      <Section>
        <GenericSectionItem style={styles.freeParkingSection}>
          <ThemeIcon svg={SvgParking} size="large" />
          <ThemeText>
            {t(
              MobilityTexts.freeBikeParkingSpaces(
                station?.numDocksAvailable?.toString() ?? '0',
              ),
            )}
          </ThemeText>
        </GenericSectionItem>
      </Section>
      <Section>
        <LinkSectionItem
          text={t(MobilityTexts.helpText)}
          onPress={() =>
            navigateSupportCallback({
              operatorId: station?.system.operator.id ?? '',
              stationId: station?.id ?? '',
              formFactor: FormFactor.Bicycle,
            })
          }
        />
      </Section>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      paddingHorizontal: theme.spacing.medium,
      paddingBottom: theme.spacing.medium,
      gap: theme.spacing.medium,
    },
    freeParkingSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.small,
    },
  };
});
