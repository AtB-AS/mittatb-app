import {StyleSheet} from '@atb/theme';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {Linking} from 'react-native';
import * as Sections from '@atb/components/sections';
import {MessageBoxAction, MessageBoxV2} from '@atb/components/message-box';
import {getTextForLanguageWithFormat} from '@atb/translations/utils';
import {FlexibleTransport} from '@atb/assets/svg/color/illustrations';
import {CityZone} from '@atb/reference-data/types';
import {useFirestoreConfiguration} from '@atb/configuration';
import {useJourneyModes} from '../utils';

export type CityZoneMessageProps = {
  cityZones: CityZone[];
};

export const CityZoneMessage: React.FC<CityZoneMessageProps> = ({
  cityZones,
}) => {
  const style = useStyle();
  const {language} = useTranslation();

  const {
    cityZoneMessageTexts: {singleZone, multipleZones},
  } = useFirestoreConfiguration();
  const {isFlexibleTransportEnabled} = useJourneyModes();

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

  if (!isFlexibleTransportEnabled) {
    return null;
  }

  const messageTemplate = cityZones.length == 1 ? singleZone : multipleZones;

  const message = getTextForLanguageWithFormat(
    messageTemplate.message,
    language,
    ...cityZones.map((cityZone) => cityZone.name),
  );

  const openUrlForCityZone = (cityZone: CityZone) => {
    const contactUrl = getTextForLanguage(cityZone.contactUrl, language);
    if (contactUrl) {
      return Linking.openURL(contactUrl);
    }
  };

  const messageActions = cityZones.map(
    (cityZone) =>
      ({
        text: cityZone.name,
        type: 'button',
        onPress: () => openUrlForCityZone(cityZone),
      } as MessageBoxAction),
  );

  if (message && messageActions) {
    return (
      <Sections.Section style={style.cityZoneMessage}>
        <MessageBoxV2
          type="default"
          message={message}
          icon={() => <FlexibleTransport />}
          onDismiss={() => {
            setClosed(true);
          }}
          actions={messageActions}
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
  websiteButton: {
    margin: theme.spacings.medium,
  },
}));
