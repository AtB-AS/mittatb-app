import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
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
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {FullScreenFooter} from '@atb/components/screen-footer';

type Props = {
  close: () => void;
};

export const ServiceDisruptionSheet = forwardRef<View, Props>(
  ({close}, focusRef) => {
    const {t} = useTranslation();
    const {service_disruption_url} = useRemoteConfig();
    const hasValidServiceDisruptionUrl = true;
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
        <FullScreenFooter>
          <GlobalMessage
            style={style.globalMessages}
            globalMessageContext="app-assistant"
            includeDismissed={true}
          />

          {hasValidServiceDisruptionUrl && (
            <>
              <Sections.Section style={style.serviceDisruptionText}>
                <View ref={focusRef} accessible>
                  <ThemeText>{t(ServiceDisruptionsTexts.body)}</ThemeText>
                </View>
              </Sections.Section>
              <Button
                interactiveColor="interactive_3"
                mode="secondary"
                text={t(ServiceDisruptionsTexts.button.text)}
                accessibilityHint={t(ServiceDisruptionsTexts.button.a11yHint)}
                rightIcon={{svg: ExternalLink}}
                onPress={() => {
                  Linking.openURL(service_disruption_url);
                  close();
                }}
                testID="navigateToServiceDisruptions"
              />
            </>
          )}
        </FullScreenFooter>
      </BottomSheetContainer>
    );
  },
);

const useStyle = StyleSheet.createThemeHook((theme) => ({
  globalMessages: {
    marginBottom: theme.spacings.medium,
  },
  serviceDisruptionText: {
    marginBottom: theme.spacings.medium,
  },
}));
