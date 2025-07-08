import {Confirm, Delete} from '@atb/assets/svg/mono-icons/actions';
import {Button} from '@atb/components/button';
import {FullScreenView} from '@atb/components/screen-view';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';
import {useState} from 'react';
import {Alert} from 'react-native';
import {RootStackScreenProps} from '..';
import {ScreenHeading} from '@atb/components/heading';
import {
  useEditVehicleRegistrationMutation,
  useDeleteVehicleRegistrationMutation,
} from '@atb/modules/smart-park-and-ride';

type Props = RootStackScreenProps<'Root_SmartParkAndRideEditScreen'>;

export const Root_SmartParkAndRideEditScreen = ({
  navigation,
  route: {params},
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const [licensePlate, setLicensePlate] = useState(
    params.vehicleRegistration.licensePlate,
  );
  const {theme} = useThemeContext();

  const onSuccess = () => navigation.goBack();
  const {mutateAsync: handleEditVehicleRegistration} =
    useEditVehicleRegistrationMutation(
      params.vehicleRegistration.id,
      licensePlate,
      onSuccess,
    );

  const {mutateAsync: handleDeleteVehicleRegistration} =
    useDeleteVehicleRegistrationMutation(
      params.vehicleRegistration.id,
      onSuccess,
    );

  const showDeleteConfirmation = () => {
    Alert.alert(
      t(SmartParkAndRideTexts.edit.delete.confirmation.title),
      t(SmartParkAndRideTexts.edit.delete.confirmation.message),
      [
        {
          text: t(SmartParkAndRideTexts.edit.delete.confirmation.cancel),
          style: 'cancel',
        },
        {
          text: t(SmartParkAndRideTexts.edit.delete.confirmation.confirm),
          style: 'destructive',
          onPress: () => handleDeleteVehicleRegistration(),
        },
      ],
    );
  };

  return (
    <FullScreenView
      headerProps={{
        title: t(SmartParkAndRideTexts.edit.header.title),
        leftButton: {type: 'back', withIcon: true},
        color: theme.color.background.neutral[1],
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(SmartParkAndRideTexts.edit.header.title)}
        />
      )}
      footer={
        <FullScreenFooter>
          <Button
            expanded={true}
            onPress={() => handleEditVehicleRegistration()}
            text={t(SmartParkAndRideTexts.edit.button)}
            rightIcon={{svg: Confirm}}
            mode="primary"
          />
          <Button
            expanded={true}
            onPress={showDeleteConfirmation}
            text={t(SmartParkAndRideTexts.edit.delete.button)}
            rightIcon={{svg: Delete}}
            mode="secondary"
            backgroundColor={theme.color.background.neutral[1]}
            style={styles.deleteButton}
          />
        </FullScreenFooter>
      }
    >
      <Section style={styles.content}>
        <TextInputSectionItem
          label={t(SmartParkAndRideTexts.edit.inputs.licensePlate.label)}
          placeholder={t(
            SmartParkAndRideTexts.edit.inputs.licensePlate.placeholder,
          )}
          onChangeText={setLicensePlate}
          autoCapitalize="characters"
          value={licensePlate}
          inlineLabel={false}
          autoFocus={true}
        />
      </Section>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  content: {
    margin: theme.spacing.medium,
  },
  deleteButton: {
    marginTop: theme.spacing.medium,
  },
}));
