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
import {getBookingRequirementForLeg, getPublicCodeFromLeg} from '../utils';
import {FlexibleTransportMessageBox} from './FlexibleTransportMessageBox';
import {useNow} from '@atb/utils/use-now';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

import {Dimensions} from 'react-native';

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

  const {flex_transport_about_urls, flex_booking_number_of_days_available} =
    useRemoteConfig();

  const publicCode = getPublicCodeFromLeg(leg);

  const now = useNow(2500);
  const bookingRequirement = getBookingRequirementForLeg(
    leg,
    now,
    flex_booking_number_of_days_available,
  );

  return (
    <BottomSheetContainer>
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

      <ScrollView style={style.contentContainer}>
        <View style={style.messageBoxContainer}>
          <FlexibleTransportMessageBox
            bookingRequirement={bookingRequirement}
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
          onPress={() =>
            Linking.openURL(
              getTextForLanguage(flex_transport_about_urls, language) || '',
            )
          }
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

        {bookingRequirement.bookingIsAvailable && (
          <FlexibleTransportBookingOptions leg={leg} />
        )}

        <View style={style.paddingBottomEnsurer} />
      </ScrollView>
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
  contentContainer: {
    backgroundColor: theme.static.background.background_0.background,
    borderRadius: theme.spacings.medium,
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.large,
    padding: theme.spacings.xLarge,
    paddingBottom: 0,
  },
  paddingBottomEnsurer: {
    height: theme.spacings.xLarge,
    //backgroundColor: 'red', // for reviewer: can use this to debug scroll padding issue
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
