import {useTheme, StyleSheet} from '@atb/theme';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {Linking} from 'react-native';
import * as Sections from '@atb/components/sections';
import {MessageBox} from '@atb/components/message-box';
import {getTextForLanguageWithFormat} from '@atb/translations/utils';
import {FlexBuss} from '@atb/assets/svg/color/illustrations';
import {CityZone} from '@atb/reference-data/types';
import {useFirestoreConfiguration} from '@atb/configuration';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

export type CityZoneMessageProps = {
  cityZones: CityZone[];
};

export const CityZoneMessage: React.FC<CityZoneMessageProps> = ({
  cityZones,
}) => {
  const style = useStyle();
  const {theme} = useTheme();
  const {language} = useTranslation();

  const {
    cityZoneMessageTexts: {singleZone, multipleZones},
  } = useFirestoreConfiguration();
  const {enable_flexible_transport} = useRemoteConfig();

  const [isClosed, setClosed] = useState(false);

  useEffect(() => {
    setClosed(false);

    return () => {
      setClosed(false);
    };
  }, [cityZones]);

  if (cityZones.length === 0 || isClosed) {
    return null;
  }

  if (!enable_flexible_transport) {
    return null;
  }

  const cityZonesNames = cityZones.map((cityZone) => cityZone.name);
  const contactUrls = cityZones
    .map((cityZone) => getTextForLanguage(cityZone.contactUrl, language))
    .filter(Boolean) as string[];

  const messageTexts = cityZones.length == 1 ? singleZone : multipleZones;

  const message = getTextForLanguageWithFormat(
    messageTexts.message,
    language,
    ...cityZonesNames,
  );
  const actionButtonText = getTextForLanguage(
    messageTexts.actionButtonText,
    language,
  );

  if (message && actionButtonText && contactUrls.length > 0) {
    return (
      <Sections.Section style={style.cityZoneMessage}>
        <MessageBox
          type="info"
          message={message}
          color={theme.static.background.background_0}
          icon={() => <FlexBuss />}
          onDismiss={() => {
            setClosed(true);
          }}
          onPressConfig={{
            action: () => {
              if (contactUrls.length === 1) {
                return Linking.openURL(contactUrls[0]);
              }

              // TODO: What if more?
            },
            text: actionButtonText,
          }}
        />
      </Sections.Section>
    );
  }

  return null;
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
