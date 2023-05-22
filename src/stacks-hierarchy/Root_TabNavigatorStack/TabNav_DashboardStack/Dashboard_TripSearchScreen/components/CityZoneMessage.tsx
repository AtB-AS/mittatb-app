import {StyleSheet, useTheme} from '@atb/theme';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {Linking, TouchableOpacity, View} from 'react-native';
import {FlexibleTransport} from '@atb/assets/svg/color/illustrations';
import {CityZone} from '@atb/reference-data/types';
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
import CityBoxMessageTexts from '@atb/translations/components/CityBoxMessage';

type ActionButton = {
  text: string;
  onPress: () => void;
};

export type CityZoneMessageProps = {
  from: Location | undefined;
  to: Location | undefined;
  onDismiss: () => void;
};

export const CityZoneMessage: React.FC<CityZoneMessageProps> = ({
  from,
  to,
  onDismiss,
}) => {
  const style = useStyle();
  const {t, language} = useTranslation();

  const selectedCityZones = useFindCityZonesInLocations(from, to);

  if (!selectedCityZones?.length) {
    return null;
  }

  const openUrlForCityZone = (cityZone: CityZone) => {
    const contactUrl = getTextForLanguage(cityZone.contactUrl, language);
    if (contactUrl) {
      Linking.openURL(contactUrl);
    }
  };

  const messageActions = selectedCityZones.map((cityZone) => ({
    text: cityZone.name,
    onPress: () => openUrlForCityZone(cityZone),
  }));

  if (messageActions) {
    return (
      <Section style={style.cityZoneMessage}>
        <CityZoneBox
          message={t(CityBoxMessageTexts.message)}
          icon={() => <FlexibleTransport />}
          onDismiss={onDismiss}
          actionButtons={messageActions}
        />
      </Section>
    );
  }

  return null;
};

type CityZoneBoxProps = {
  icon: (props: SvgProps) => JSX.Element;
  message: string;
  onDismiss?: () => void;
  actionButtons?: ActionButton[];
};

const CityZoneBox = ({
  icon,
  message,
  actionButtons,
  onDismiss,
}: CityZoneBoxProps) => {
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
        <ThemeText style={styles.message} color={generalColor}>
          {message}
        </ThemeText>
        {actionButtons && (
          <View style={styles.actions}>
            {actionButtons.map((actionButton) => (
              <Button
                type="pill"
                interactiveColor="interactive_3"
                text={actionButton.text}
                onPress={actionButton.onPress}
                style={styles.action}
                accessibilityRole="link"
                accessibilityHint={t(CityBoxMessageTexts.a11yHint)}
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
  message: {
    paddingRight: theme.spacings.small,
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
