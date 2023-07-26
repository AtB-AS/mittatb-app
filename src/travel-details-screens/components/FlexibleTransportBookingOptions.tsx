import {Phone} from '@atb/assets/svg/mono-icons/devices';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {useTranslation, TripDetailsTexts} from '@atb/translations';
import {Leg} from '@atb/api/types/trips';
import {View, Linking} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {TripRow} from './TripRow';
import {Button} from '@atb/components/button';
import {BookingMethod} from '@atb/api/types/generated/journey_planner_v3_types';

type FlexibleTransportBookingOptionsProps = {
  leg: Leg;
};

export const FlexibleTransportBookingOptions: React.FC<
  FlexibleTransportBookingOptionsProps
> = ({leg}) => {
  const {t} = useTranslation();
  const style = useStyle();

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
      <View style={style.flexBookingOptions}>
        <TripRow>
          {showBookOnlineOption && (
            <View style={style.flexBookingOption}>
              <Button
                text={t(TripDetailsTexts.trip.leg.bookOnline)}
                onPress={() => Linking.openURL(bookingUrl)}
                mode="primary"
                type="pill"
                interactiveColor="interactive_0"
                leftIcon={{svg: ExternalLink}}
              />
            </View>
          )}
          {showBookByPhoneOption && (
            <View style={style.flexBookingOption}>
              <Button
                text={t(TripDetailsTexts.trip.leg.bookByPhone(bookingPhone))}
                onPress={() => Linking.openURL(`tel:${bookingPhone}`)}
                style={style.bookByPhoneButton}
                type="pill"
                interactiveColor="interactive_3"
                leftIcon={{svg: Phone}}
              />
            </View>
          )}
        </TripRow>
      </View>
    );
  } else {
    return null;
  }
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  flexBookingOptions: {
    paddingVertical: theme.spacings.medium / 2,
  },
  flexBookingOption: {
    paddingVertical: theme.spacings.medium / 2,
  },
  bookByPhoneButton: {
    backgroundColor: theme.interactive.interactive_3.default.background,
  },
}));
