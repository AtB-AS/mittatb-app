import React from 'react';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {FullScreenHeader} from '@atb/components/screen-header';
import {Section} from '@atb/components/sections';
import {useTranslation} from '@atb/translations';
import GenericWebsiteInformationScreen from '@atb/translations/screens/subscreens/GenericWebsiteInformationScreen';

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
