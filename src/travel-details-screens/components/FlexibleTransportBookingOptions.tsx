import {Phone} from '@atb/assets/svg/mono-icons/devices';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {useTranslation, TripDetailsTexts} from '@atb/translations';
import {Leg} from '@atb/api/types/trips';
import {View, Linking} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {Button} from '@atb/components/button';
import {BookingMethod} from '@atb/api/types/generated/journey_planner_v3_types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type FlexibleTransportBookingOptionsProps = {
  leg: Leg;
};

export const FlexibleTransportBookingOptions: React.FC<
  FlexibleTransportBookingOptionsProps
> = ({leg}) => {
  const {t} = useTranslation();
  const style = useStyle();

  const {theme} = useTheme();
  const {bottom: safeAreaBottom} = useSafeAreaInsets();

  const bookingArrangements = leg.bookingArrangements;

  const bookingPhone = bookingArrangements?.bookingContact?.phone;
  const bookingUrl = bookingArrangements?.bookingContact?.url;

  const bookingMethods = bookingArrangements?.bookingMethods;

  const showBookOnlineOption =
    bookingUrl && bookingMethods?.some((bm) => bm === BookingMethod.Online);
  const showBookByPhoneOption =
    bookingPhone &&
    bookingMethods?.some((bm) => bm === BookingMethod.CallOffice);

  if (showBookOnlineOption || showBookByPhoneOption) {
    return (
      <>
        {showBookOnlineOption && (
          <View
            style={style.flexBookingOption}
            accessible={true}
            accessibilityRole="link"
          >
            <Button
              text={t(TripDetailsTexts.flexibleTransport.bookOnline)}
              onPress={() => Linking.openURL(bookingUrl)}
              mode="primary"
              type="pill"
              interactiveColor="interactive_0"
              leftIcon={{svg: ExternalLink}}
            />
          </View>
        )}
        {showBookByPhoneOption && (
          <View
            style={style.flexBookingOption}
            accessible={true}
            accessibilityHint={t(
              TripDetailsTexts.flexibleTransport.bookByPhoneA11yHint,
            )}
          >
            <Button
              text={t(
                TripDetailsTexts.flexibleTransport.bookByPhone(bookingPhone),
              )}
              onPress={() => Linking.openURL(`tel:${bookingPhone}`)}
              style={style.bookByPhoneButton}
              type="pill"
              interactiveColor="interactive_3"
              leftIcon={{svg: Phone}}
            />
          </View>
        )}
        <View // 200% zoom bugfix for FlexibleTransportBookingDetails
          style={{height: Math.max(safeAreaBottom, theme.spacings.medium)}}
        />
      </>
    );
  } else {
    return null;
  }
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  flexBookingOption: {
    paddingVertical: theme.spacings.medium / 2,
  },
  bookByPhoneButton: {
    backgroundColor: theme.interactive.interactive_3.default.background,
  },
}));
