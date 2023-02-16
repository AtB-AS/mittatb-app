import {Button} from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import React, {forwardRef} from 'react';
import {View} from 'react-native';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {MessageBox} from '@atb/components/message-box';
import FlexibleTransportText from '@atb/translations/components/FlexibleTransportDetails';

export type BookingDetails = {
  phoneNumber: string;
  aimedStartTime: Date | string;
};

type Props = {
  close: () => void;
  contactDetails: BookingDetails;
};

const FlexibleTransportContactDetails = forwardRef<View, Props>(
  ({close, contactDetails}) => {
    const {t, language} = useTranslation();
    const styles = useStyles();

    return (
      <BottomSheetContainer>
        <View>
          <ScreenHeaderWithoutNavigation
            title={''}
            leftButton={{
              type: 'cancel',
              onPress: close,
              text: t(ScreenHeaderTexts.headerButton.cancel.text),
            }}
            color={'background_1'}
            setFocusOnLoad={false}
          />
        </View>
        <View style={styles.padding}>
          <MessageBox
            type="info"
            title={t(
              FlexibleTransportText.contactMessage.title(
                contactDetails.phoneNumber,
              ),
            )}
            style={styles.infoBox}
            message={t(
              FlexibleTransportText.infoMessage(
                contactDetails.aimedStartTime,
                language,
              ),
            )}
          />
        </View>
        <Button
          style={styles.padding}
          text={t(
            FlexibleTransportText.contactMessage.callAction(
              contactDetails.phoneNumber,
            ),
          )}
          onPress={() => {}}
          mode="primary"
          interactiveColor="interactive_0"
        />
      </BottomSheetContainer>
    );
  },
);

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    padding: {
      marginBottom: theme.spacings.small,
      marginLeft: theme.spacings.medium,
      marginRight: theme.spacings.medium,
    },
    infoBox: {
      backgroundColor: theme.static.background.background_0.background,
    },
  };
});

export default FlexibleTransportContactDetails;
