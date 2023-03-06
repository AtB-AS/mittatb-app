import {Button} from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import React, {forwardRef} from 'react';
import {Linking, View} from 'react-native';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import FlexibleTransportText from '@atb/translations/components/FlexibleTransportDetails';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';
import Warning from '@atb/assets/svg/color/icons/status/Warning';
import {FullScreenFooter} from '@atb/components/screen-footer';

export type ContactDetails = {
  phoneNumber: string;
  aimedStartTime: Date | string;
};

type Props = {
  close: () => void;
  contactDetails: ContactDetails;
};

const FlexibleTransportContactDetails = forwardRef<View, Props>(
  ({close, contactDetails}) => {
    const {t, language} = useTranslation();
    const styles = useStyles();

    return (
      <BottomSheetContainer>
        <View>
          <ScreenHeaderWithoutNavigation
            leftButton={{
              type: 'close',
              onPress: close,
              text: t(ScreenHeaderTexts.headerButton.close.text),
            }}
            color={'background_1'}
            setFocusOnLoad={false}
          />
        </View>
        <FullScreenFooter>
          <View style={styles.container}>
            <View style={styles.tittleContainer}>
              <ThemeIcon svg={Warning} />
              <ThemeText type="heading__title" style={styles.tittlePadding}>
                {t(
                  FlexibleTransportText.contactMessage.title(
                    contactDetails.phoneNumber,
                  ),
                )}
              </ThemeText>
            </View>
            <ThemeText type="body__primary" style={styles.messageContainer}>
              {t(
                FlexibleTransportText.infoMessage(
                  contactDetails.aimedStartTime,
                  language,
                ),
              )}
            </ThemeText>
          </View>
          <View style={styles.contactButtonContainer}>
            <Button
              text={t(
                FlexibleTransportText.contactMessage.callAction(
                  contactDetails.phoneNumber,
                ),
              )}
              onPress={() => {
                Linking.openURL(`tel:${contactDetails.phoneNumber}`);
              }}
              mode="primary"
              interactiveColor="interactive_0"
            />
          </View>
        </FullScreenFooter>
      </BottomSheetContainer>
    );
  },
);

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      marginHorizontal: theme.spacings.medium,
      padding: theme.spacings.large,
      borderRadius: theme.border.radius.regular,
      backgroundColor: theme.static.background.background_0.background,
    },
    tittleContainer: {
      flexDirection: 'row',
    },
    tittlePadding: {
      paddingLeft: theme.spacings.small,
    },
    messageContainer: {
      paddingTop: theme.spacings.medium,
    },
    contactButtonContainer: {
      margin: theme.spacings.medium,
    },
  };
});

export default FlexibleTransportContactDetails;
