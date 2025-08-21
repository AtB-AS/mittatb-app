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
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {CarFill} from '@atb/assets/svg/mono-icons/transportation';
import {
  SmartParkAndRideOnboardingProvider,
  useShouldShowSmartParkAndRideOnboarding,
  useVehicleRegistrationsQuery,
  VehicleRegistration,
} from '@atb/modules/smart-park-and-ride';
import {spellOut} from '@atb/utils/accessibility';
import {statusTypeToIcon} from '@atb/utils/status-type-to-icon';
import {useEffect} from 'react';
import {ThemedBundlingCarSharing} from '@atb/theme/ThemedAssets';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useAuthContext} from '@atb/modules/auth';

const MAX_VEHICLE_REGISTRATIONS = 2;

const Profile_SmartParkAndRideScreenContent = () => {
  const {t} = useTranslation();
  const {themeName} = useThemeContext();
  const styles = useStyles();
  const navigation = useNavigation<RootNavigationProps>();
  const {data: vehicleRegistrations, isLoading: isLoadingVehicleRegistrations} =
    useVehicleRegistrationsQuery();
  const {authStatus} = useAuthContext();

  const shouldShowOnboarding = useShouldShowSmartParkAndRideOnboarding();
  const canAddVehicleRegistrations =
    (vehicleRegistrations?.length ?? 0) < MAX_VEHICLE_REGISTRATIONS;
  const hasVehicleRegistrations =
    !!vehicleRegistrations?.length && !isLoadingVehicleRegistrations;

  // Auto-navigate to onboarding if user hasn't seen it yet and has no vehicles registered
  useEffect(() => {
    if (shouldShowOnboarding && !hasVehicleRegistrations) {
      navigation.navigate('Root_SmartParkAndRideOnboardingStack');
    }
  }, [shouldShowOnboarding, hasVehicleRegistrations, navigation]);

  return (
    <FullScreenView
      headerProps={{
        title: t(SmartParkAndRideTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
    >
      <View style={styles.container}>
        <ContentHeading text={t(SmartParkAndRideTexts.content.heading)} />
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
              onPress={() =>
                navigation.navigate('Root_SmartParkAndRideEditScreen', {
                  transitionOverride: 'slide-from-right',
                  vehicleRegistration,
                })
              }
              onPressIcon={Edit}
            />
          ))}

          {canAddVehicleRegistrations && (
            <LinkSectionItem
              text={t(SmartParkAndRideTexts.content.addVehicle)}
              onPress={() =>
                navigation.navigate('Root_SmartParkAndRideAddScreen', {
                  transitionOverride: 'slide-from-right',
                })
              }
              rightIcon={{svg: Add}}
            />
          )}
        </Section>

        {authStatus === 'authenticated' && (
          <MessageInfoBox
            type="warning"
            title={t(SmartParkAndRideTexts.notLoggedIn.title)}
            message={t(SmartParkAndRideTexts.notLoggedIn.message)}
          />
        )}

        {!canAddVehicleRegistrations && (
          <View style={styles.maxVehiclesInfo}>
            <ThemeIcon svg={statusTypeToIcon('info', true, themeName)} />
            <ThemeText>{t(SmartParkAndRideTexts.add.max)}</ThemeText>
          </View>
        )}

        <HowItWorksSection
          onPress={() => {
            navigation.navigate('Root_SmartParkAndRideOnboardingStack');
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
            <ThemedBundlingCarSharing
              height={61}
              width={61}
              style={{
                alignSelf: 'flex-start',
              }}
            />
            <View style={styles.howItWorks}>
              <ThemeText typography="body__primary--bold">
                {t(SmartParkAndRideTexts.howItWorks.title)}
              </ThemeText>
              <ThemeText typography="body__secondary" color="secondary">
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

const Profile_SmartParkAndRideScreen = () => {
  return (
    <SmartParkAndRideOnboardingProvider>
      <Profile_SmartParkAndRideScreenContent />
    </SmartParkAndRideOnboardingProvider>
  );
};

export {Profile_SmartParkAndRideScreen};
