import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import Button from '@atb/components/button';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
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

type Props = {
  close: () => void;
  serviceDisruptionUrl: string;
};

const ServiceDisruptionSheet = forwardRef<View, Props>(
  ({close, serviceDisruptionUrl}, focusRef) => {
    const {t} = useTranslation();

    return (
      <BottomSheetContainer>
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

        <Sections.Section withFullPadding>
          <View ref={focusRef} accessible>
            <ThemeText>{t(ServiceDisruptionsTexts.body)}</ThemeText>
          </View>
        </Sections.Section>

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
export default ServiceDisruptionSheet;
