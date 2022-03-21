import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import Button from '@atb/components/button';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import * as Sections from '@atb/components/sections';
import {
  DisappearingHeaderTexts,
  ScreenHeaderTexts,
  useTranslation,
} from '@atb/translations';
import React, {forwardRef} from 'react';
import {Linking} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import ThemeText from '../text';

type Props = {
  close: () => void;
  serviceDisruptionUrl: string;
};

const ServiceDisruptionSheet = forwardRef<ScrollView, Props>(
  ({close, serviceDisruptionUrl}) => {
    const {t} = useTranslation();

    return (
      <BottomSheetContainer>
        <ScreenHeaderWithoutNavigation
          title={t(DisappearingHeaderTexts.serviceDisruptions.header.title)}
          leftButton={{
            type: 'cancel',
            onPress: close,
            text: t(ScreenHeaderTexts.headerButton.cancel.text),
            testID: 'cancelButton',
          }}
          color={'background_2'}
          setFocusOnLoad={false}
        />

        <Sections.Section withFullPadding>
          <ThemeText>
            {t(DisappearingHeaderTexts.serviceDisruptions.body)}
          </ThemeText>
        </Sections.Section>

        <FullScreenFooter>
          <Button
            color="primary_2"
            text={t(DisappearingHeaderTexts.serviceDisruptions.button.text)}
            onPress={() => {
              Linking.openURL(serviceDisruptionUrl);
              close();
            }}
            testID="saveTicketTypeButton"
          />
        </FullScreenFooter>
      </BottomSheetContainer>
    );
  },
);
export default ServiceDisruptionSheet;
