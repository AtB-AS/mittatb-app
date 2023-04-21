import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import * as Sections from '@atb/components/sections';
import {
  ScreenHeaderTexts,
  ServiceDisruptionsTexts,
  useTranslation,
} from '@atb/translations';
import React, {forwardRef} from 'react';
import {Linking, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {GlobalMessage} from '@atb/global-messages';
import {StyleSheet} from '@atb/theme';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';

type Props = {
  close: () => void;
  serviceDisruptionUrl: string;
};

export const ServiceDisruptionSheet = forwardRef<View, Props>(
  ({close, serviceDisruptionUrl}, focusRef) => {
    const {t} = useTranslation();
    const style = useStyle();

    return (
      <BottomSheetContainer testID="serviceDisruptionsBottomSheet">
        <ScreenHeaderWithoutNavigation
          title={t(ServiceDisruptionsTexts.header.title)}
          leftButton={{
            type: 'cancel',
            onPress: close,
            text: t(ScreenHeaderTexts.headerButton.cancel.text),
            testID: 'cancelButton',
          }}
          color={'background_1'}
          setFocusOnLoad={false}
        />
        <GlobalMessage
          style={style.globalMessages}
          globalMessageContext="app-assistant"
          showAllMessages={true}
        />
        <Sections.Section style={style.serviceDisruptionText}>
          <View ref={focusRef} accessible>
            <ThemeText>{t(ServiceDisruptionsTexts.body)}</ThemeText>
          </View>
        </Sections.Section>

        <FullScreenFooter>
          <Button
            interactiveColor="interactive_3"
            mode="secondary"
            text={t(ServiceDisruptionsTexts.button.text)}
            accessibilityHint={t(ServiceDisruptionsTexts.button.a11yHint)}
            rightIcon={{svg: ExternalLink}}
            onPress={() => {
              Linking.openURL(serviceDisruptionUrl);
              close();
            }}
            testID="navigateToServiceDisruptions"
          />
        </FullScreenFooter>
      </BottomSheetContainer>
    );
  },
);

const useStyle = StyleSheet.createThemeHook((theme) => ({
  globalMessages: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  serviceDisruptionText: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
}));
