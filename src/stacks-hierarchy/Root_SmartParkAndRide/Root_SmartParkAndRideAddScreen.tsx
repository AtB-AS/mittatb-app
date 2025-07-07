import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {Button} from '@atb/components/button';
import {FullScreenView} from '@atb/components/screen-view';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {useAddVehicleRegistrationMutation} from '@atb/modules/smart-park-and-ride';
import {LicensePlateInputSectionItem} from '@atb/modules/smart-park-and-ride';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemedBundlingCarSharing} from '@atb/theme/ThemedAssets';
import {useTranslation} from '@atb/translations';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';
import {useState} from 'react';
import {View} from 'react-native';
import {RootStackScreenProps} from '..';
import {FullScreenFooter} from '@atb/components/screen-footer';

type Props = RootStackScreenProps<'Root_SmartParkAndRideAddScreen'>;

export const Root_SmartParkAndRideAddScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const [nickname, setNickname] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const {theme} = useThemeContext();

  const onSuccess = () => navigation.goBack();
  const {mutateAsync: handleAddVehicleRegistration} =
    useAddVehicleRegistrationMutation(licensePlate, nickname, onSuccess);

  return (
    <FullScreenView
      headerProps={{
        title: t(SmartParkAndRideTexts.add.header.title),
        leftButton: {type: 'back', withIcon: true},
        color: theme.color.background.neutral[1],
      }}
      footer={
        <FullScreenFooter>
          <Button
            expanded={true}
            onPress={() => handleAddVehicleRegistration()}
            text={t(SmartParkAndRideTexts.add.footer.add)}
            rightIcon={{svg: Confirm}}
          />
          <Button
            expanded={true}
            onPress={() => navigation.goBack()}
            text={t(SmartParkAndRideTexts.add.footer.later)}
            style={styles.laterButton}
            mode="secondary"
            backgroundColor={theme.color.background.neutral[1]}
          />
        </FullScreenFooter>
      }
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <ThemedBundlingCarSharing style={styles.illustration} width={150} />
          <ThemeText typography="body__primary--big--bold">
            {t(SmartParkAndRideTexts.add.content.title)}
          </ThemeText>
          <ThemeText typography="body__primary" style={styles.descriptionText}>
            {t(SmartParkAndRideTexts.add.content.text)}
          </ThemeText>
        </View>
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
          <LicensePlateInputSectionItem
            value={licensePlate}
            onChange={setLicensePlate}
          />
        </Section>
      </View>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.small,
    margin: theme.spacing.large,
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.medium,
    marginTop: theme.spacing.xLarge * 3,
    marginBottom: theme.spacing.xLarge,
  },
  illustration: {
    marginBottom: theme.spacing.xLarge,
  },
  laterButton: {
    marginTop: theme.spacing.medium,
  },
  descriptionText: {
    textAlign: 'center',
  },
}));
