import {
  getTextForLanguage,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {Leg} from '@atb/api/types/trips';
import {Dimensions, View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {BookingOptions} from './BookingOptions';
import {getBookingStatus, getPublicCodeFromLeg} from '../utils';
import {BookingInfoBox} from './BookingInfoBox';
import {useNow} from '@atb/utils/use-now';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import React from 'react';
import {ThemedBestillMaxi} from '@atb/theme/ThemedAssets';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {openInAppBrowser} from '@atb/modules/in-app-browser';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
} from '@atb/components/bottom-sheet';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';

const {width, height} = Dimensions.get('window');
const isSmallScreen = width < 320 || height < 568;

type FlexibleTransportBookingDetailsProps = {
  leg: Leg;
  bottomSheetModalRef: React.RefObject<GorhomBottomSheetModal | null>;
  onCloseFocusRef: React.RefObject<View | null>;
};

export const FlexibleTransportBookingDetailsSheet: React.FC<
  FlexibleTransportBookingDetailsProps
> = ({leg, bottomSheetModalRef, onCloseFocusRef}) => {
  const {t, language} = useTranslation();
  const style = useStyle();
  const {theme} = useThemeContext();

  const {flex_booking_number_of_days_available} = useRemoteConfigContext();
  const {configurableLinks} = useFirestoreConfigurationContext();

  const publicCode = getPublicCodeFromLeg(leg);

  const now = useNow(30000);
  const bookingStatus = getBookingStatus(
    leg.bookingArrangements,
    leg.aimedStartTime,
    now,
    flex_booking_number_of_days_available,
  );

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(
        TripDetailsTexts.flexibleTransport.needsBookingWhatIsThisTitle(
          publicCode,
        ),
      )}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      closeCallback={() => giveFocus(onCloseFocusRef)}
    >
      <View style={style.container}>
        <View style={{padding: theme.spacing.xLarge}}>
          <View style={style.messageBoxContainer}>
            <BookingInfoBox
              bookingArrangements={leg.bookingArrangements}
              aimedStartTime={leg.aimedStartTime}
              now={now}
            />
          </View>

          {!isSmallScreen && (
            <View style={style.imageContainer}>
              <ThemedBestillMaxi height={177} />
            </View>
          )}

          <ThemeText typography="heading__m" style={style.title}>
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
                    key={stepInstructionText}
                    style={style.step}
                    accessible={true}
                    accessibilityLabel={stepNumberText + stepInstructionText}
                    accessibilityRole="text"
                  >
                    <ThemeText typography="body__m">{stepNumberText}</ThemeText>
                    <ThemeText typography="body__m">
                      {stepInstructionText}
                    </ThemeText>
                  </View>
                );
              })
            }
          </View>

          <PressableOpacity
            style={style.readMoreAbout}
            onPress={() => {
              const flexTransportInfoUrl = getTextForLanguage(
                configurableLinks?.flexTransportInfo,
                language,
              );
              flexTransportInfoUrl &&
                openInAppBrowser(flexTransportInfoUrl, 'close');
            }}
            accessibilityRole="link"
            accessibilityHint={t(
              TripDetailsTexts.flexibleTransport.readMoreAboutA11yHint(
                publicCode,
              ),
            )}
          >
            <ThemeText
              color="secondary"
              style={style.linkText}
              typography="body__m__underline"
            >
              {t(TripDetailsTexts.flexibleTransport.readMoreAbout(publicCode))}
            </ThemeText>
          </PressableOpacity>

          {bookingStatus === 'bookable' && (
            <BookingOptions bookingArrangements={leg.bookingArrangements} />
          )}
        </View>
      </View>
    </BottomSheetModal>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  title: {
    paddingHorizontal: theme.spacing.small,
    paddingTop: theme.spacing.small,
  },
  container: {
    backgroundColor: theme.color.background.neutral[0].background,
    borderRadius: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
    flex: 1,
  },
  messageBoxContainer: {
    paddingBottom: theme.spacing.small,
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: theme.spacing.large,
    paddingTop: theme.spacing.large,
  },
  steps: {
    paddingHorizontal: theme.spacing.small,
    paddingTop: theme.spacing.medium,
    paddingBottom: theme.spacing.xSmall,
  },
  step: {
    display: 'flex',
    flexDirection: 'row',
  },
  linkText: {
    marginTop: theme.spacing.medium,
    alignSelf: 'flex-start',
  },
  readMoreAbout: {
    paddingHorizontal: theme.spacing.small,
    paddingVertical: theme.spacing.small,
    marginBottom: theme.spacing.medium,
  },
}));
