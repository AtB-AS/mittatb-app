import {Button} from '@atb/components/button';
import {FullScreenHeader} from '@atb/components/screen-header';
import {PhoneInputSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {LoginTexts, PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import { OnBehalfOfTexts } from '@atb/translations/screens/subscreens/OnBehalfOf';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import phone from 'phone';
import {useState} from 'react';
import {KeyboardAvoidingView, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

type Props = RootStackScreenProps<'Root_ChooseTicketReceiverScreen'>;
const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const Root_ChooseTicketReceiverScreen: React.FC<Props> = ({
  navigation,
  route: {params},
}) => {
  const styles = useStyles();

  const {t} = useTranslation();

  const [prefix, setPrefix] = useState('47');
  const [phoneNumber, setPhoneNumber] = useState('');

  const focusRef = useFocusOnLoad();

  const phoneValidationParams = {
    strictDetection: true,
    validateMobilePrefix: false,
  };

  const isValidPhoneNumber = (number: string) => {
    const validationResult = phone(
      '+' + prefix + number,
      phoneValidationParams,
    );
    return validationResult.isValid;
  };

  const {
    fromPlace,
    toPlace,
    preassignedFareProduct,
    userProfilesWithCount,
    travelDate,
  } = params;

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'back'}}
        title={t(OnBehalfOfTexts.chooseReceiver.header)}
        setFocusOnLoad={false}
      />
      <KeyboardAvoidingView behavior="padding" style={styles.mainView}>
        <ScrollView
          centerContent={true}
          keyboardShouldPersistTaps="handled"
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <View accessible={true} accessibilityRole="header" ref={focusRef}>
            <ThemeText
              type="heading--big"
              color={themeColor}
              style={styles.header}
            >
              {t(OnBehalfOfTexts.chooseReceiver.title)}
            </ThemeText>
          </View>
          <View accessible={true}>
            <ThemeText
              type="body__primary"
              color={themeColor}
              style={styles.subheader}
            >
              {t(OnBehalfOfTexts.chooseReceiver.subtitle)}
            </ThemeText>
          </View>
          <Section>
            <PhoneInputSectionItem
              label={t(LoginTexts.phoneInput.input.heading)}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              prefix={prefix}
              onChangePrefix={setPrefix}
              showClear={true}
              keyboardType="number-pad"
              placeholder={t(LoginTexts.phoneInput.input.placeholder)}
              autoFocus={true}
              textContentType="telephoneNumber"
            />
          </Section>
          <Button
            style={styles.submitButton}
            interactiveColor="interactive_0"
            onPress={() => {
              navigation.navigate('Root_PurchaseConfirmationScreen', {
                fareProductTypeConfig: params.fareProductTypeConfig,
                fromPlace: fromPlace,
                toPlace: toPlace,
                userProfilesWithCount: userProfilesWithCount,
                preassignedFareProduct,
                travelDate,
                headerLeftButton: {type: 'back'},
                mode: params.mode,
                phoneNumber: phoneNumber,
              });
            }}
            text={t(PurchaseOverviewTexts.summary.button)}
            disabled={!isValidPhoneNumber(phoneNumber)}
            testID="toPaymentButton"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
  },
  mainView: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    paddingBottom: theme.spacings.xLarge,
  },
  contentContainerStyle: {
    paddingHorizontal: theme.spacings.large,
    paddingBottom: theme.spacings.xLarge,
  },
  header: {
    alignContent: 'space-around',
    textAlign: 'center',
  },
  subheader: {
    textAlign: 'center',
    marginTop: theme.spacings.medium,
    marginBottom: theme.spacings.xLarge,
  },
  submitButton: {
    marginTop: theme.spacings.medium,
  },
}));
