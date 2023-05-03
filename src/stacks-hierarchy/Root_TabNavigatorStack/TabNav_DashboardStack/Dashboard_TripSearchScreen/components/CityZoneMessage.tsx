import {StyleSheet, useTheme} from '@atb/theme';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import {getTextForLanguageWithFormat} from '@atb/translations/utils';
import {FlexibleTransport} from '@atb/assets/svg/color/illustrations';
import {CityZone} from '@atb/reference-data/types';
import {useFirestoreConfiguration} from '@atb/configuration';
import {Location} from '@atb/favorites';
import {useFindCityZonesInLocations} from '../hooks';
import {SvgProps} from 'react-native-svg';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import MessageBoxTexts from '@atb/translations/components/MessageBox';
import {insets} from '@atb/utils/insets';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {Section} from '@atb/components/sections';

type ActionButton = {
  text: string;
  onPress: () => void;
};

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

  if (!selectedCityZones || isClosed) {
    return null;
  }

  if (selectedCityZones.length === 0) {
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
        onPress: () => openUrlForCityZone(cityZone),
      } as ActionButton),
  );

  if (message && messageActions) {
    return (
      <Section style={style.cityZoneMessage}>
        <MessageBoxWithActionButtons
          message={message}
          icon={() => <FlexibleTransport />}
          onDismiss={() => {
            setClosed(true);
          }}
          actionButtons={messageActions}
        />
      </Section>
    );
  }

  return null;
};

type MessageBoxWithActionButtonsProps = {
  icon: (props: SvgProps) => JSX.Element;
  message: string;
  onDismiss?: () => void;
  actionButtons?: ActionButton[];
};

const MessageBoxWithActionButtons = ({
  icon,
  message,
  actionButtons,
  onDismiss,
}: MessageBoxWithActionButtonsProps) => {
  const {theme} = useTheme();
  const styles = useStyle();
  const {t} = useTranslation();
  const generalColor = theme.static.background.background_0;
  const {background: backgroundColor, text: textColor} = generalColor;
  return (
    <View style={[styles.container, {backgroundColor}]} accessible={false}>
      <View style={styles.icon}>
        <ThemeIcon svg={icon} />
      </View>
      <View style={styles.content}>
        <ThemeText color={generalColor}>{message}</ThemeText>
        {actionButtons && (
          <View style={styles.actions}>
            {actionButtons.map((actionButton) => (
              <Button
                type="pill"
                interactiveColor="interactive_3"
                text={actionButton.text}
                onPress={actionButton.onPress}
                style={styles.action}
                rightIcon={{svg: ExternalLink}}
              />
            ))}
          </View>
        )}
      </View>
      {onDismiss && (
        <View>
          <TouchableOpacity
            onPress={onDismiss}
            accessible={true}
            accessibilityLabel={t(MessageBoxTexts.dismiss.allyLabel)}
            accessibilityRole="button"
            hitSlop={insets.all(theme.spacings.medium)}
          >
            <ThemeIcon fill={textColor} svg={Close} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
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
  // Message Box styles
  container: {
    padding: theme.spacings.medium,
    borderRadius: theme.border.radius.regular,
    flexDirection: 'row',
  },
  icon: {
    marginRight: theme.spacings.medium,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  action: {
    marginTop: theme.spacings.medium,
    marginRight: theme.spacings.medium,
  },
  actions: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
}));
