import {PhoneInput} from '@atb/components/phone-input';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {OnBehalfOfTexts} from '@atb/translations/screens/subscreens/OnBehalfOf';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
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

  const focusRef = useFocusOnLoad();

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
          <PhoneInput
            submitButtonText={t(PurchaseOverviewTexts.summary.button)}
            submitButtonTestId="toPaymentButton"
            // TODO: this is just a placeholder, update when API is ready
            onSubmitPromise={() => new Promise((r) => setTimeout(r, 1000))}
            onSubmitAction={(number) => {
              navigation.navigate('Root_PurchaseConfirmationScreen', {
                ...params,
                phoneNumber: number,
              });
            }}
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
  activityIndicator: {
    marginVertical: theme.spacings.large,
  },
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
  buttonView: {
    marginTop: theme.spacings.medium,
  },
  submitButton: {
    marginTop: theme.spacings.medium,
  },
}));