import {Add} from '@atb/assets/svg/mono-icons/actions';
import {Button} from '@atb/components/button';
import {FullScreenView} from '@atb/components/screen-view';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {useAddVehicleRegistrationMutation} from '@atb/modules/smart-park-and-ride';
import {LicensePlateSection} from '@atb/modules/smart-park-and-ride';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemedCarFront} from '@atb/theme/ThemedAssets';
import {TranslateFunction, useTranslation} from '@atb/translations';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';
import {useState} from 'react';
import {View} from 'react-native';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useAuthContext} from '@atb/modules/auth';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {RootStackScreenProps} from '../navigation-types';

type Props = RootStackScreenProps<'Root_SmartParkAndRideAddScreen'>;
export const Root_SmartParkAndRideAddScreen = ({navigation}: Props) => {
  {
    const {t} = useTranslation();
    const styles = useStyles();
    const [nickname, setNickname] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const {theme} = useThemeContext();
    const focusRef = useFocusOnLoad(true);
    const {authenticationType} = useAuthContext();
    const analytics = useAnalyticsContext();

    const {
      mutateAsync: handleAddVehicleRegistration,
      error: addVehicleRegistrationError,
    } = useAddVehicleRegistrationMutation(licensePlate, nickname, () => {
      analytics.logEvent('Smart Park & Ride', 'Vehicle added', {
        hasNickname: nickname.length > 0,
      });
      navigation.popTo('Root_TabNavigatorStack', {
        screen: 'TabNav_ProfileStack',
        params: {
          screen: 'Profile_SmartParkAndRideScreen',
          params: {toast: 'vehicleAdded'},
        },
      });
    });

    const themeColor = theme.color.background.accent[0];

    const contentNode = (
      <View style={styles.container}>
        <View style={styles.content}>
          <ThemedCarFront style={styles.illustration} width={170} />
          <View ref={focusRef} accessible={true} accessibilityRole="header">
            <ThemeText typography="body__m__strong">
              {t(SmartParkAndRideTexts.add.content.title)}
            </ThemeText>
          </View>
          <ThemeText typography="body__m" style={styles.descriptionText}>
            {t(SmartParkAndRideTexts.add.content.text)}
          </ThemeText>
        </View>

        {authenticationType !== 'phone' && (
          <MessageInfoBox
            type="warning"
            title={t(SmartParkAndRideTexts.notLoggedIn.title)}
            message={t(SmartParkAndRideTexts.notLoggedIn.message)}
          />
        )}
        <Section>
          <TextInputSectionItem
            label={t(SmartParkAndRideTexts.add.inputs.nickname.label)}
            placeholder={t(
              SmartParkAndRideTexts.add.inputs.nickname.placeholder,
            )}
            onChangeText={setNickname}
            value={nickname}
            inlineLabel={false}
          />
        </Section>

        <LicensePlateSection
          inputProps={{
            value: licensePlate,
            onChangeText: setLicensePlate,
          }}
        />
      </View>
    );

    const footerNode = (
      <View style={styles.footer}>
        {addVehicleRegistrationError && (
          <MessageInfoBox
            type="error"
            message={getErrorMessageTranslation(
              addVehicleRegistrationError?.kind,
              t,
            )}
          />
        )}
        <Button
          expanded={true}
          onPress={() => {
            analytics.logEvent('Smart Park & Ride', 'Add vehicle clicked');
            handleAddVehicleRegistration();
          }}
          text={t(SmartParkAndRideTexts.add.footer.add)}
          rightIcon={{svg: Add}}
        />
      </View>
    );

    return (
      <FullScreenView
        headerProps={{
          title: t(SmartParkAndRideTexts.add.header.title),
          leftButton: {type: 'back'},
        }}
        contentColor={themeColor}
        avoidKeyboard={true}
      >
        {contentNode}
        {footerNode}
      </FullScreenView>
    );
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {top: safeAreaTop} = useSafeAreaInsets();
  return {
    container: {
      rowGap: theme.spacing.small,
      margin: theme.spacing.large,
    },
    content: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: theme.spacing.medium,
      marginTop: theme.spacing.xLarge * 2,
      marginBottom: theme.spacing.xLarge,
    },
    illustration: {
      marginBottom: theme.spacing.large,
    },
    descriptionText: {
      textAlign: 'center',
    },
    footer: {
      display: 'flex',
      gap: theme.spacing.medium,
      padding: theme.spacing.large,
      paddingTop: theme.spacing.medium,
    },
    hideHeaderContainer: {
      paddingTop: safeAreaTop,
      flex: 1,
      backgroundColor: theme.color.background.accent[0].background,
    },
    flex: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
  };
});

function getErrorMessageTranslation(
  kind: string | undefined,
  t: TranslateFunction,
) {
  switch (kind) {
    case 'INVALID_LICENSE_PLATE':
      return t(SmartParkAndRideTexts.errors.invalidLicensePlate);
    case 'VEHICLE_REGISTRATION_ALREADY_EXISTS':
      return t(SmartParkAndRideTexts.errors.vehicleAlreadyAdded);
    case 'MAXIMUM_NUMBER_OF_VEHICLE_REGISTRATIONS_REACHED':
      return t(SmartParkAndRideTexts.errors.maximumNumberOfVehiclesReached);
    default:
      return t(SmartParkAndRideTexts.errors.unknown);
  }
}
