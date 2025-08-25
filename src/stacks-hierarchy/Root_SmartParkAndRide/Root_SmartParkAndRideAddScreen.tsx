import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {Button} from '@atb/components/button';
import {FullScreenView} from '@atb/components/screen-view';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {useAddVehicleRegistrationMutation} from '@atb/modules/smart-park-and-ride';
import {LicensePlateSection} from '@atb/modules/smart-park-and-ride';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemedBundlingCarSharing} from '@atb/theme/ThemedAssets';
import {useTranslation} from '@atb/translations';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';
import {useState} from 'react';
import {View, ScrollView} from 'react-native';
import {RootStackScreenProps} from '..';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {useAuthContext} from '@atb/modules/auth';
import {MessageInfoBox} from '@atb/components/message-info-box';

type Props = RootStackScreenProps<'Root_SmartParkAndRideAddScreen'>;

export const Root_SmartParkAndRideAddScreen = ({navigation, route}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const [nickname, setNickname] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const {theme} = useThemeContext();
  const focusRef = useFocusOnLoad(true);
  const {authenticationType} = useAuthContext();

  const hideHeader = route.params.hideHeader;

  const navigateBack = () => {
    navigation.getParent()?.goBack() ?? navigation.goBack();
  };

  const {mutateAsync: handleAddVehicleRegistration} =
    useAddVehicleRegistrationMutation(licensePlate, nickname, navigateBack);

  const themeColor = theme.color.background.accent[0];

  const contentNode = (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedBundlingCarSharing style={styles.illustration} width={150} />
        <View ref={focusRef} accessible={true} accessibilityRole="header">
          <ThemeText typography="body__primary--big--bold">
            {t(SmartParkAndRideTexts.add.content.title)}
          </ThemeText>
        </View>
        <ThemeText typography="body__primary" style={styles.descriptionText}>
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
          placeholder={t(SmartParkAndRideTexts.add.inputs.nickname.placeholder)}
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
      <Button
        expanded={true}
        onPress={() => handleAddVehicleRegistration()}
        text={t(SmartParkAndRideTexts.add.footer.add)}
        rightIcon={{svg: Confirm}}
      />
      <Button
        expanded={true}
        onPress={navigateBack}
        text={t(SmartParkAndRideTexts.add.footer.later)}
        mode="secondary"
        backgroundColor={theme.color.background.accent[0]}
      />
    </View>
  );

  if (hideHeader) {
    return (
      <View style={styles.hideHeaderContainer}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
        >
          {contentNode}
        </ScrollView>
        <FullScreenFooter footerColor={themeColor.background}>
          {footerNode}
        </FullScreenFooter>
      </View>
    );
  }

  return (
    <FullScreenView
      headerProps={{
        title: t(SmartParkAndRideTexts.add.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      contentColor={themeColor}
      avoidKeyboard={true}
      footer={footerNode}
    >
      {contentNode}
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
    marginTop: theme.spacing.xLarge * 2,
    marginBottom: theme.spacing.large,
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
    paddingTop: theme.spacing.medium,
  },
  hideHeaderContainer: {
    flex: 1,
    backgroundColor: theme.color.background.accent[0].background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
}));
