import {useTheme, StyleSheet} from '@atb/theme';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {Linking, View} from 'react-native';
import * as Sections from '@atb/components/sections';
import {MessageBox} from '@atb/components/message-box';
import {getTextForLanguageWithFormat} from '@atb/translations/utils';
import {FlexBuss} from '@atb/assets/svg/color/illustrations';
import {CityZone} from '@atb/reference-data/types';

export type CityZoneMessageProps = {
  cityZone: CityZone;
};

export const CityZoneMessage: React.FC<CityZoneMessageProps> = ({cityZone}) => {
  const {theme} = useTheme();
  const {language} = useTranslation();
  const style = useStyle();
  const [isClosed, setClosed] = useState(false);

  const zoneName = getTextForLanguage(cityZone.name, language);

  useEffect(() => {
    setClosed(false);

    return () => {
      setClosed(false);
    };
  }, [zoneName]);

  if (!zoneName || isClosed) {
    return <></>;
  }

  const message = getTextForLanguageWithFormat(
    cityZone.message,
    language,
    zoneName,
  );
  const actionButtonText = getTextForLanguage(
    cityZone.actionButtonText,
    language,
  );
  const contactUrl = getTextForLanguage(cityZone.contactUrl, language);

  if (message && actionButtonText && contactUrl) {
    return (
      <Sections.Section style={style.cityZoneMessage}>
        <MessageBox
          type="info"
          title={getTextForLanguage(cityZone.title, language)}
          message={message}
          color={theme.static.background.background_0}
          icon={() => <FlexBuss />}
          onDismiss={() => {
            setClosed(true);
          }}
          onPressConfig={{
            action: () => {
              Linking.openURL(contactUrl);
            },
            text: actionButtonText,
          }}
        />
      </Sections.Section>
    );
  }

  return <></>;
};

export const useStyle = StyleSheet.createThemeHook((theme) => ({
  cityZoneMessage: {
    marginTop: theme.spacings.medium,
    marginHorizontal: theme.spacings.medium,
  },
  flexIcon: {
    marginRight: theme.spacings.medium,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
}));
