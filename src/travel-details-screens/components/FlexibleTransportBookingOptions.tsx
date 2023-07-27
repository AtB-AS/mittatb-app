import {Phone} from '@atb/assets/svg/mono-icons/devices';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {useTranslation, FlexibleTransportTexts} from '@atb/translations';
import {Leg} from '@atb/api/types/trips';
import {View, Linking} from 'react-native';
import {StyleSheet} from '@atb/theme';
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
      <>
        {showBookOnlineOption && (
          <View style={style.flexBookingOption}>
            <Button
              text={t(FlexibleTransportTexts.bookOnline)}
              onPress={() => Linking.openURL(bookingUrl)} // TODO: add url info for auto-completion?
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
              text={t(FlexibleTransportTexts.bookByPhone(bookingPhone))}
              onPress={() => Linking.openURL(`tel:${bookingPhone}`)}
              style={style.bookByPhoneButton}
              type="pill"
              interactiveColor="interactive_3"
              leftIcon={{svg: Phone}}
            />
          </View>
        )}
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
