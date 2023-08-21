import {FlexibleTransport} from '@atb/assets/svg/color/images';
import {CloseCircle} from '@atb/assets/svg/color/icons/actions';
import {
  useTranslation,
  getTextForLanguage,
  TripDetailsTexts,
} from '@atb/translations';
import {Leg} from '@atb/api/types/trips';
import {View, TouchableOpacity, Linking, ScrollView} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';

import {ThemeText} from '@atb/components/text';
import {FlexibleTransportBookingOptions} from './FlexibleTransportBookingOptions';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {getPublicCodeFromLeg, getLegBookingIsAvailable} from '../utils';
import {FlexibleTransportMessageBox} from './FlexibleTransportMessageBox';
import {useNow} from '@atb/utils/use-now';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

import {Dimensions} from 'react-native';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('window');
const isSmallScreen = width < 320 || height < 568;

type FlexibleTransportBookingDetailsProps = {
  leg: Leg;
  close: () => void;
};

export const FlexibleTransportBookingDetails: React.FC<
  FlexibleTransportBookingDetailsProps
> = ({leg, close}) => {
  const {t, language} = useTranslation();
  const style = useStyle();
  const {theme} = useTheme();

  const {flex_booking_number_of_days_available} = useRemoteConfig();
  const {configurableLinks} = useFirestoreConfiguration();

  const publicCode = getPublicCodeFromLeg(leg);

  const now = useNow(2500);
  const bookingIsAvailable = getLegBookingIsAvailable(
    leg,
    now,
    flex_booking_number_of_days_available,
  );

  const {bottom: safeAreaBottom} = useSafeAreaInsets();
  const marginBottom =
    safeAreaBottom > 0 ? safeAreaBottom : theme.spacings.medium;

  return (
    <BottomSheetContainer fullHeight={true} maxHeightValue={0.83}>
      <ScreenHeaderWithoutNavigation
        title={t(
          TripDetailsTexts.flexibleTransport.needsBookingWhatIsThisTitle(
            publicCode,
          ),
        )}
        color="background_1"
        setFocusOnLoad={false}
      />
      <TouchableOpacity style={style.closeIconContainer} onPress={close}>
        <CloseCircle height={theme.icon.size.large} />
      </TouchableOpacity>

      <View style={[style.scrollViewContainer, {marginBottom}]}>
        <ScrollView contentContainerStyle={{padding: theme.spacings.xLarge}}>
          <View style={style.messageBoxContainer}>
            <FlexibleTransportMessageBox
              leg={leg}
              publicCode={publicCode}
              now={now}
              showStatusIcon={true}
            />
          </View>

          {!isSmallScreen && (
            <View style={style.imageContainer}>
              <FlexibleTransport height={107} />
            </View>
          )}

          <ThemeText type="heading__title" style={style.title}>
            {t(TripDetailsTexts.flexibleTransport.contentTitle(publicCode))}
          </ThemeText>
          <View style={style.steps} accessibilityRole="list">
            {
              // eslint-disable-next-line rulesdir/translations-warning
              TripDetailsTexts.flexibleTransport.steps.map((step, i) => {
                const stepNumberText = `${i + 1}. `;
                const stepInstructionText = t(step);
                return (
                  <View
                    key={i}
                    style={style.step}
                    accessible={true}
                    accessibilityLabel={stepNumberText + stepInstructionText}
                    accessibilityRole="text"
                  >
                    <ThemeText type="body__primary">{stepNumberText}</ThemeText>
                    <ThemeText type="body__primary">
                      {stepInstructionText}
                    </ThemeText>
                  </View>
                );
              })
            }
          </View>

          <TouchableOpacity
            style={style.readMoreAbout}
            onPress={() => {
              const flexTransportInfoUrl = getTextForLanguage(
                configurableLinks?.flexTransportInfo,
                language,
              );
              flexTransportInfoUrl && Linking.openURL(flexTransportInfoUrl);
            }}
            accessibilityRole="link"
          >
            <ThemeText
              color="secondary"
              style={style.linkText}
              type="body__primary--underline"
            >
              {t(TripDetailsTexts.flexibleTransport.readMoreAbout(publicCode))}
            </ThemeText>
          </TouchableOpacity>

          {bookingIsAvailable && <FlexibleTransportBookingOptions leg={leg} />}
        </ScrollView>
      </View>
    </BottomSheetContainer>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  title: {
    paddingHorizontal: theme.spacings.small,
    paddingTop: theme.spacings.small,
  },
  closeIconContainer: {
    position: 'absolute',
    top: theme.spacings.large / 2 + theme.spacings.small,
    right: theme.spacings.medium,
  },
  scrollViewContainer: {
    backgroundColor: theme.static.background.background_0.background,
    borderRadius: theme.spacings.medium,
    marginHorizontal: theme.spacings.medium,
    flex: 1,
  },
  messageBoxContainer: {
    paddingBottom: theme.spacings.small,
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: theme.spacings.large,
  },
  steps: {
    paddingHorizontal: theme.spacings.small,
    paddingTop: theme.spacings.medium,
    paddingBottom: theme.spacings.xSmall,
  },
  step: {
    display: 'flex',
    flexDirection: 'row',
  },
  linkText: {
    marginTop: theme.spacings.medium,
    alignSelf: 'flex-start',
  },
  readMoreAbout: {
    paddingHorizontal: theme.spacings.small,
    paddingVertical: theme.spacings.small,
    marginBottom: theme.spacings.medium,
  },
}));
