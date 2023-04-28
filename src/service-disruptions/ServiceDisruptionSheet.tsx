import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {
  ScreenHeaderTexts,
  ServiceDisruptionsTexts,
  useTranslation,
} from '@atb/translations';
import React, {forwardRef} from 'react';
import {Linking, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {Section} from '@atb/components/sections';

type Props = {
  close: () => void;
  serviceDisruptionUrl: string;
};

export const ServiceDisruptionSheet = forwardRef<View, Props>(
  ({close, serviceDisruptionUrl}, focusRef) => {
    const {t} = useTranslation();

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

        <Section withFullPadding>
          <View ref={focusRef} accessible>
            <ThemeText>{t(ServiceDisruptionsTexts.body)}</ThemeText>
          </View>
        </Section>

        <FullScreenFooter>
          <Button
            interactiveColor="interactive_0"
            text={t(ServiceDisruptionsTexts.button.text)}
            accessibilityHint={t(ServiceDisruptionsTexts.button.a11yHint)}
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
