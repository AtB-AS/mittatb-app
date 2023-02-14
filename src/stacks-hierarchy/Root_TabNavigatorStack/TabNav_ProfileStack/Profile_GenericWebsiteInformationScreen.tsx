import React from 'react';
import {useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import GenericWebsiteInformationScreen from '@atb/translations/screens/subscreens/GenericWebsiteInformationScreen';
import {View} from 'react-native';
import {FullScreenHeader} from '@atb/components/screen-header';
import {Section} from '@atb/components/sections';

export const Profile_GenericWebsiteInformationScreen = () => {
  const {t} = useTranslation();

  return (
    <View>
      <FullScreenHeader
        title={t(GenericWebsiteInformationScreen.title)}
        leftButton={{type: 'back'}}
      />

      <View>
        <Section withTopPadding withPadding>
          <ThemeText>{t(GenericWebsiteInformationScreen.message)}</ThemeText>
        </Section>
      </View>
    </View>
  );
};
