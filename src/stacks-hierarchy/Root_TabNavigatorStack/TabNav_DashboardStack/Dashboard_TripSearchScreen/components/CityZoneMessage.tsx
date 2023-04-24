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
import {Location} from '@atb/favorites';
import {useFindCityZonesInLocations} from '../utils';

export type CityZoneMessageProps = {
  from: Location | undefined;
  to: Location | undefined;
};

export const CityZoneMessage: React.FC<CityZoneMessageProps> = ({from, to}) => {
  const style = useStyle();
  const {language} = useTranslation();

  const {
    cityZoneMessageTexts: {singleZone, multipleZones},
  } = useFirestoreConfiguration();

  const selectedCityZones = useFindCityZonesInLocations(from, to);

  const [isClosed, setClosed] = useState(false);

  useEffect(() => {
    setClosed(false);

    return () => {
      setClosed(false);
    };
  }, [selectedCityZones]);

  if (!selectedCityZones) {
    return null;
  }

  if (selectedCityZones.length === 0 || isClosed) {
    return null;
  }

  const messageTemplate =
    selectedCityZones.length == 1 ? singleZone : multipleZones;

  const message = getTextForLanguageWithFormat(
    messageTemplate.message,
    language,
    ...selectedCityZones.map((cityZone) => cityZone.name),
  );

  const openUrlForCityZone = (cityZone: CityZone) => {
    const contactUrl = getTextForLanguage(cityZone.contactUrl, language);
    if (contactUrl) {
      return Linking.openURL(contactUrl);
    }
  };

  const messageActions = selectedCityZones.map(
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
