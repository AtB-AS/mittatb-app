import {StyleSheet, useThemeContext} from '@atb/theme';
import {TranslateFunction, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {FullScreenView} from '@atb/components/screen-view';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
  SelectionInlineSectionItem,
} from '@atb/components/sections';
import {Add, Edit} from '@atb/assets/svg/mono-icons/actions';
import {ContentHeading} from '@atb/components/heading';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';
import {CarFill} from '@atb/assets/svg/mono-icons/transportation';
import {
  useVehicleRegistrationsQuery,
  VehicleRegistration,
} from '@atb/modules/smart-park-and-ride';
import {spellOut} from '@atb/utils/accessibility';
import {statusTypeToIcon} from '@atb/utils/status-type-to-icon';
import {ThemedCarRegister} from '@atb/theme/ThemedAssets';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useAuthContext} from '@atb/modules/auth';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useMemo, useState} from 'react';
import {ProfileScreenProps} from './navigation-types';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

const MAX_VEHICLE_REGISTRATIONS = 2;

type SmartParkAndRideToastType =
  | 'vehicleAdded'
  | 'vehicleUpdated'
  | 'vehicleDeleted';

export type SmartParkAndRideScreenParams = {
  toast?: SmartParkAndRideToastType;
};

type Props = ProfileScreenProps<'Profile_SmartParkAndRideScreen'>;
export const Profile_SmartParkAndRideScreen = ({route, navigation}: Props) => {
  const {t} = useTranslation();
  const {themeName} = useThemeContext();
  const styles = useStyles();
  const {
    data: vehicleRegistrations,
    refetch: refetchVehicleRegistrations,
    isFetching: vehicleRegistrationsIsFetching,
  } = useVehicleRegistrationsQuery();
  const {authenticationType} = useAuthContext();
  const analytics = useAnalyticsContext();
  const [showNotLoggedInWarning, setShowNotLoggedInWarning] = useState(
    authenticationType !== 'phone',
  );

  const canAddVehicleRegistrations =
    (vehicleRegistrations?.length ?? 0) < MAX_VEHICLE_REGISTRATIONS;
  const toast = route.params?.toast;

  const getToastMessage = (type: SmartParkAndRideToastType) => {
    switch (type) {
      case 'vehicleAdded':
        return t(SmartParkAndRideTexts.success.vehicleAdded);
      case 'vehicleUpdated':
        return t(SmartParkAndRideTexts.success.vehicleUpdated);
      case 'vehicleDeleted':
        return t(SmartParkAndRideTexts.success.vehicleDeleted);
    }
  };

  const refreshControlProps = useMemo(() => {
    return {
      refreshing: vehicleRegistrationsIsFetching,
      onRefresh: refetchVehicleRegistrations,
    };
  }, [vehicleRegistrationsIsFetching, refetchVehicleRegistrations]);

  const focusRef = useFocusOnLoad(navigation);

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title: t(SmartParkAndRideTexts.header.title),
        leftButton: {type: 'back'},
      }}
      refreshControlProps={refreshControlProps}
    >
      <View style={styles.container}>
        <ContentHeading
          text={t(
            SmartParkAndRideTexts.content.heading(
              vehicleRegistrations?.length ?? 0,
            ),
          )}
        />
        <Section>
          {vehicleRegistrations?.map((vehicleRegistration) => (
            <SelectionInlineSectionItem
              key={vehicleRegistration.id}
              label={
                vehicleRegistration.nickname || vehicleRegistration.licensePlate
              }
              value={
                vehicleRegistration.nickname
                  ? vehicleRegistration.licensePlate
                  : undefined
              }
              icon={CarFill}
              accessibility={{
                accessibilityLabel: getAccessibilityLabel(
                  vehicleRegistration,
                  t,
                ),
              }}
              onPress={() => {
                analytics.logEvent(
                  'Smart Park & Ride',
                  'Edit vehicle clicked',
                  {
                    vehicleId: vehicleRegistration.id,
                    hasNickname: !!vehicleRegistration.nickname,
                  },
                );
                navigation.navigate('Root_SmartParkAndRideEditScreen', {
                  transitionOverride: 'slide-from-right',
                  vehicleRegistration,
                });
              }}
              onPressIcon={Edit}
            />
          ))}

          {canAddVehicleRegistrations && (
            <LinkSectionItem
              text={t(SmartParkAndRideTexts.content.addVehicle)}
              onPress={() => {
                analytics.logEvent(
                  'Smart Park & Ride',
                  'Add vehicle from main screen clicked',
                );
                navigation.navigate('Root_SmartParkAndRideAddScreen', {
                  transitionOverride: 'slide-from-right',
                });
              }}
              rightIcon={{svg: Add}}
            />
          )}
        </Section>

        {!!toast && (
          <MessageInfoBox
            type="valid"
            message={getToastMessage(toast)}
            style={styles.successBox}
          />
        )}

        {showNotLoggedInWarning && (
          <MessageInfoBox
            type="warning"
            title={t(SmartParkAndRideTexts.notLoggedIn.title)}
            message={t(SmartParkAndRideTexts.notLoggedIn.message)}
            onDismiss={() => {
              analytics.logEvent(
                'Smart Park & Ride',
                'Not logged in message dismissed',
              );
              setShowNotLoggedInWarning(false);
            }}
          />
        )}

        {!canAddVehicleRegistrations && !toast && (
          <View style={styles.maxVehiclesInfo}>
            <ThemeIcon svg={statusTypeToIcon('info', true, themeName)} />
            <ThemeText>{t(SmartParkAndRideTexts.add.max)}</ThemeText>
          </View>
        )}

        <HowItWorksSection
          onPress={() => {
            analytics.logEvent('Smart Park & Ride', 'How it works clicked');
            navigation.navigate({
              name: 'Root_OnboardingCarouselStack',
              params: {configId: 'spar-pilot'},
            });
          }}
        />
      </View>
    </FullScreenView>
  );
};

type HowItWorksSectionProps = {
  onPress: () => void;
};

const HowItWorksSection = ({onPress}: HowItWorksSectionProps) => {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <>
      <ContentHeading text={t(SmartParkAndRideTexts.howItWorks.heading)} />
      <Section>
        <GenericSectionItem>
          <View style={styles.horizontalContainer}>
            <ThemedCarRegister
              height={63}
              width={63}
              style={{
                alignSelf: 'flex-start',
              }}
            />
            <View style={styles.howItWorks}>
              <ThemeText typography="body__m__strong">
                {t(SmartParkAndRideTexts.howItWorks.title)}
              </ThemeText>
              <ThemeText typography="body__s" color="secondary">
                {t(SmartParkAndRideTexts.howItWorks.description)}
              </ThemeText>
            </View>
          </View>
        </GenericSectionItem>
        <LinkSectionItem
          text={t(SmartParkAndRideTexts.howItWorks.link)}
          onPress={onPress}
        />
      </Section>
    </>
  );
};

const getAccessibilityLabel = (
  vehicleRegistration: VehicleRegistration,
  t: TranslateFunction,
) => {
  const carIcon = t(SmartParkAndRideTexts.a11y.carIcon);
  const button = t(SmartParkAndRideTexts.a11y.button);

  if (vehicleRegistration.nickname) {
    // If there's a nickname, announce both nickname and license plate
    return `${carIcon}. ${vehicleRegistration.nickname}, ${spellOut(
      vehicleRegistration.licensePlate,
    )}. ${button}`;
  } else {
    // If no nickname, announce only license plate
    return `${carIcon}. ${spellOut(
      vehicleRegistration.licensePlate,
    )}. ${button}`;
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.small,
    marginTop: theme.spacing.large,
    margin: theme.spacing.medium,
  },
  text: {
    textAlign: 'center',
  },
  successBox: {
    marginTop: theme.spacing.xSmall,
  },
  maxVehiclesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
    marginTop: theme.spacing.xSmall,
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
  },
  howItWorks: {
    flex: 1,
    gap: theme.spacing.xSmall,
  },
}));
