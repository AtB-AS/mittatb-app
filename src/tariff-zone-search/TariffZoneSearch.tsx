import {RouteProp, useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, TextInput as InternalTextInput, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Close} from '../assets/svg/icons/actions';
import {TextInput} from '../components/sections';
import ThemeText from '../components/text';
import ThemeIcon from '../components/theme-icon';
import MessageBox from '../message-box';
import {RootStackParamList} from '../navigation';
import FullScreenHeader from '../ScreenHeader/full-header';
import {StyleSheet} from '../theme';
import {TariffZoneSearchNavigationProp} from './';
import TariffZoneResults from './TariffZoneResults';
import {TariffZoneSearchTexts, useTranslation} from '../translations/';
import useDebounce from '../utils/useDebounce';
import {useTicketState} from '../TicketContext';
import {TariffZone} from '../api/tariffZones';

export type Props = {
  navigation: TariffZoneSearchNavigationProp;
  route: RouteProp<RootStackParamList, 'TariffZoneSearch'>;
};

export type RouteParams = {
  callerRouteName: string;
  callerRouteParam: string;
  label: string;
};

const TariffZoneSearch: React.FC<Props> = ({
  navigation,
  route: {
    params: {callerRouteName, callerRouteParam, label},
  },
}) => {
  const styles = useThemeStyles();

  const [text, setText] = useState<string>('');
  const debouncedText = useDebounce(text, 200);
  const {t} = useTranslation();

  const {tariffZones} = useTicketState();

  const onSelect = (tariffZone: TariffZone) => {
    navigation.navigate(callerRouteName as any, {
      [callerRouteParam]: tariffZone,
    });
  };

  const inputRef = useRef<InternalTextInput>(null);

  const isFocused = useIsFocused();

  // using setTimeout to counteract issue of other elements
  // capturing focus on mount and on press
  const focusInput = () => setTimeout(() => inputRef.current?.focus(), 0);

  useEffect(() => {
    if (isFocused) focusInput();
  }, [isFocused]);

  const filteredTariffZones = tariffZones.filter((tz) =>
    tz.name.value.includes(debouncedText),
  );

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(TariffZoneSearchTexts.header.title)}
        leftButton={{
          onPress: () => navigation.goBack(),
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: t(
            TariffZoneSearchTexts.header.leftButton.a11yLabel,
          ),
          icon: <ThemeIcon svg={Close} />,
        }}
      />

      <View style={styles.header}>
        <View style={styles.withMargin}>
          <TextInput
            ref={inputRef}
            radius="top-bottom"
            label={label}
            value={text}
            onChangeText={setText}
            showClear={Boolean(text?.length)}
            onClear={() => setText('')}
            placeholder={t(TariffZoneSearchTexts.searchField.placeholder)}
            autoCorrect={false}
            autoCompleteType="off"
          />
        </View>
      </View>

      {filteredTariffZones.length ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentBlock}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={() => Keyboard.dismiss()}
        >
          <TariffZoneResults
            title={t(TariffZoneSearchTexts.results.searchResults.heading)}
            tariffZones={filteredTariffZones}
            onSelect={onSelect}
          />
        </ScrollView>
      ) : (
        !!text && (
          <View style={styles.contentBlock}>
            <MessageBox type="info">
              <ThemeText>
                {t(TariffZoneSearchTexts.messages.emptyResult)}
              </ThemeText>
            </MessageBox>
          </View>
        )
      )}
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.background.level2,
    flex: 1,
  },
  header: {
    backgroundColor: theme.background.header,
  },
  withMargin: {
    margin: theme.spacings.medium,
  },
  contentBlock: {
    margin: theme.spacings.medium,
  },
  scroll: {
    flex: 1,
  },
}));

export default TariffZoneSearch;
