import {FlexibleTransport} from '@atb/assets/svg/color/images';
import {
  getTextForLanguage,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {Leg} from '@atb/api/types/trips';
import {
  Dimensions,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';

import {ThemeText} from '@atb/components/text';
import {BookingOptions} from './BookingOptions';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {getBookingStatus, getPublicCodeFromLeg} from '../utils';
import {BookingInfoBox} from './BookingInfoBox';
import {useNow} from '@atb/utils/use-now';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import React from 'react';

const {width, height} = Dimensions.get('window');
const isSmallScreen = width < 320 || height < 568;

type FlexibleTransportBookingDetailsProps = {
  leg: Leg;
};

export const FlexibleTransportBookingDetailsSheet: React.FC<
  FlexibleTransportBookingDetailsProps
> = ({leg}) => {
  const {t, language} = useTranslation();
  const style = useStyle();
  const {theme} = useTheme();

  const {flex_booking_number_of_days_available} = useRemoteConfig();
  const {configurableLinks} = useFirestoreConfiguration();

  const publicCode = getPublicCodeFromLeg(leg);

  const now = useNow(30000);
  const bookingStatus = getBookingStatus(
    leg.bookingArrangements,
    leg.aimedStartTime,
    now,
    flex_booking_number_of_days_available,
  );

  const {bottom: safeAreaBottom} = useSafeAreaInsets();
  const marginBottom =
    safeAreaBottom > 0 ? safeAreaBottom : theme.spacings.medium;

  return (
    <BottomSheetContainer
      title={t(
        TripDetailsTexts.flexibleTransport.needsBookingWhatIsThisTitle(
          publicCode,
        ),
      )}
      fullHeight={true}
      maxHeightValue={0.83}
    >
      <View style={[style.scrollViewContainer, {marginBottom}]}>
        <ScrollView contentContainerStyle={{padding: theme.spacings.xLarge}}>
          <View style={style.messageBoxContainer}>
            <BookingInfoBox
              bookingArrangements={leg.bookingArrangements}
              aimedStartTime={leg.aimedStartTime}
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
                    key={stepInstructionText}
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
            accessibilityHint={t(
              TripDetailsTexts.flexibleTransport.readMoreAboutA11yHint(
                publicCode,
              ),
            )}
          >
            <ThemeText
              color="secondary"
              style={style.linkText}
              type="body__primary--underline"
            >
              {t(TripDetailsTexts.flexibleTransport.readMoreAbout(publicCode))}
            </ThemeText>
          </TouchableOpacity>

          {bookingStatus === 'bookable' && (
            <BookingOptions bookingArrangements={leg.bookingArrangements} />
          )}
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
