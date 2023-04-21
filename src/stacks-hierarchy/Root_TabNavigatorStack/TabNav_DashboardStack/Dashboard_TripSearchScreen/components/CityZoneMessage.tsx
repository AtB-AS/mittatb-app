import {useTheme, StyleSheet} from '@atb/theme';
import {
  ScreenHeaderTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {Linking, View} from 'react-native';
import * as Sections from '@atb/components/sections';
import {MessageBox} from '@atb/components/message-box';
import {getTextForLanguageWithFormat} from '@atb/translations/utils';
import {FlexibleTransport} from '@atb/assets/svg/color/illustrations';
import {CityZone} from '@atb/reference-data/types';
import {useFirestoreConfiguration} from '@atb/configuration';
import {useJourneyModes} from '../utils';
import {
  BottomSheetContainer,
  useBottomSheet,
} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';

export type CityZoneMessageProps = {
  cityZones: CityZone[];
};

export const CityZoneMessage: React.FC<CityZoneMessageProps> = ({
  cityZones,
}) => {
  const style = useStyle();
  const {theme} = useTheme();
  const {t, language} = useTranslation();
  const {open: openBottomSheet} = useBottomSheet();

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

  const messageTexts = cityZones.length == 1 ? singleZone : multipleZones;

  const message = getTextForLanguageWithFormat(
    messageTexts.message,
    language,
    ...cityZones.map((cityZone) => cityZone.name),
  );
  const actionButtonText = getTextForLanguage(
    messageTexts.actionButtonText,
    language,
  );

  const openUrlForCityZone = (cityZone: CityZone) => {
    const contactUrl = getTextForLanguage(cityZone.contactUrl, language);
    if (contactUrl) {
      return Linking.openURL(contactUrl);
    }
  };

  const openWebsites = () => {
    if (cityZones.length == 1) {
      return;
    }

    openBottomSheet((close) => (
      <BottomSheetContainer>
        <View>
          <ScreenHeaderWithoutNavigation
            leftButton={{
              type: 'close',
              onPress: close,
              text: t(ScreenHeaderTexts.headerButton.close.text),
            }}
            color={'background_1'}
            setFocusOnLoad={false}
          />
        </View>
        <View>
          {cityZones.map((cityZone) => (
            <Button
              style={style.websiteButton}
              interactiveColor="interactive_0"
              text={cityZone.name}
              onPress={() => {
                openUrlForCityZone(cityZone);
                close();
              }}
              rightIcon={{svg: ExternalLink}}
            />
          ))}
        </View>
      </BottomSheetContainer>
    ));
  };

  if (message && actionButtonText) {
    return (
      <Sections.Section style={style.cityZoneMessage}>
        <MessageBox
          type="info"
          message={message}
          color={theme.static.background.background_0}
          icon={() => <FlexibleTransport />}
          onDismiss={() => {
            setClosed(true);
          }}
          onPressConfig={{
            action: openWebsites,
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
  websiteButton: {
    margin: theme.spacings.medium,
  },
}));
