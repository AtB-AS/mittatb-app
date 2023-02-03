import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StyleSheet} from '@atb/theme';
import {
  ContactSheetTexts,
  ScreenHeaderTexts,
  useTranslation,
} from '@atb/translations';
import React, {forwardRef} from 'react';
import {View} from 'react-native';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Leg} from '@atb/api/types/trips';
import {MessageBox} from '@atb/components/message-box';

type Props = {
  close: () => void;
  leg: Leg;
};

const FlexibleTransportContactDetails = forwardRef<View, Props>(
  ({close, leg}, focusRef) => {
    const {t} = useTranslation();
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
            title="Ring 02857 for å bestille sete"
            style={styles.infoBox}
            message={
              'Fleksibel transport for denne reisen krever bestilling før kl. 19.00 i dag.'
            }
          />
        </View>
        <Button
          style={styles.padding}
          text={'Ring 858585555'}
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
