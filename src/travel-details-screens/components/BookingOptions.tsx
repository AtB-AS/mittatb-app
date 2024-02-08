import {Phone} from '@atb/assets/svg/mono-icons/devices';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {TripDetailsTexts, useTranslation} from '@atb/translations';
import {Leg} from '@atb/api/types/trips';
import {Linking, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {Button} from '@atb/components/button';
import {BookingMethod} from '@atb/api/types/generated/journey_planner_v3_types';

type Props = {
  bookingArrangements: Leg['bookingArrangements'];
};

export const BookingOptions = ({bookingArrangements}: Props) => {
  const {t} = useTranslation();
  const style = useStyle();

  if (!bookingArrangements) return null;

  const bookingPhone = bookingArrangements.bookingContact?.phone;
  const bookingUrl = bookingArrangements.bookingContact?.url;

  const bookingMethods = bookingArrangements.bookingMethods;

  const showBookOnlineOption =
    bookingUrl && bookingMethods?.some((bm) => bm === BookingMethod.Online);
  const showBookByPhoneOption =
    bookingPhone &&
    bookingMethods?.some((bm) => bm === BookingMethod.CallOffice);

  return (
    <>
      {showBookOnlineOption && (
        <View style={style.flexBookingOption} accessible={false}>
          <Button
            accessible={true}
            accessibilityRole="link"
            accessibilityHint={t(
              TripDetailsTexts.flexibleTransport.bookOnlineA11yHint,
            )}
            text={t(TripDetailsTexts.flexibleTransport.bookOnline)}
            onPress={() => Linking.openURL(bookingUrl)}
            mode="primary"
            type="small"
            interactiveColor="interactive_0"
            leftIcon={{svg: ExternalLink}}
          />
        </View>
      )}
      {showBookByPhoneOption && (
        <View style={style.flexBookingOption} accessible={false}>
          <Button
            accessible={true}
            accessibilityHint={t(
              TripDetailsTexts.flexibleTransport.bookByPhoneA11yHint,
            )}
            text={t(
              TripDetailsTexts.flexibleTransport.bookByPhone(bookingPhone),
            )}
            onPress={() => Linking.openURL(`tel:${bookingPhone}`)}
            type="small"
            interactiveColor="interactive_3"
            leftIcon={{svg: Phone}}
          />
        </View>
      )}
    </>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  flexBookingOption: {
    paddingVertical: theme.spacings.medium / 2,
  },
}));
