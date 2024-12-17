import {StyleSheet, useThemeContext} from '@atb/theme';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {Linking, View} from 'react-native';
import {FlexibleTransport} from '@atb/assets/svg/color/images';
import {Location} from '@atb/favorites';
import {useFindCityZoneInLocation} from '../hooks';
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
import {useFirestoreConfigurationContext} from '@atb/configuration';
import {InteractiveColor} from '@atb/theme/colors';
import {Phone} from '@atb/assets/svg/mono-icons/devices';
import {CityZone} from '@atb/configuration';
import {useAnalyticsContext} from '@atb/analytics';
import {PressableOpacity} from '@atb/components/pressable-opacity';

type ActionButton = {
  id: string;
  text: string;
  interactiveColor: InteractiveColor;
  icon?: (props: SvgProps) => JSX.Element;
  accessibilityHint?: string;
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
  const {t} = useTranslation();
  const {cityZones} = useFirestoreConfigurationContext();
  const enabledCityZones = cityZones.filter((cityZone) => cityZone.enabled);
  const fromCityZone = useFindCityZoneInLocation(from, enabledCityZones);
  const toCityZone = useFindCityZoneInLocation(to, enabledCityZones);
  const actionButtons = useActionButtons(fromCityZone);

  if (!fromCityZone || !toCityZone) {
    return null;
  }

  if (fromCityZone.id !== toCityZone.id) {
    return null;
  }

  if (actionButtons.length > 0) {
    return (
      <Section style={style.cityZoneMessage}>
        <CityZoneBox
          message={t(CityBoxMessageTexts.message(fromCityZone.name))}
          icon={() => <FlexibleTransport />}
          onDismiss={onDismiss}
          actionButtons={actionButtons}
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
  const {theme} = useThemeContext();
  const styles = useStyle();
  const {t} = useTranslation();
  const generalColor = theme.color.background.neutral[0];
  const {
    background: backgroundColor,
    foreground: {primary: textColor},
  } = generalColor;
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
                key={actionButton.id}
                type="small"
                compact={true}
                interactiveColor={actionButton.interactiveColor}
                text={actionButton.text}
                onPress={actionButton.onPress}
                style={styles.action}
                accessibilityLabel={actionButton.text}
                accessibilityRole="link"
                accessibilityHint={actionButton.accessibilityHint}
                rightIcon={actionButton.icon && {svg: actionButton.icon}}
              />
            ))}
          </View>
        )}
      </View>
      {onDismiss && (
        <View>
          <PressableOpacity
            onPress={onDismiss}
            accessible={true}
            accessibilityLabel={t(MessageBoxTexts.dismiss.allyLabel)}
            accessibilityRole="button"
            hitSlop={insets.all(theme.spacing.medium)}
          >
            <ThemeIcon color={textColor} svg={Close} />
          </PressableOpacity>
        </View>
      )}
    </View>
  );
};

const useActionButtons = (cityZone?: CityZone) => {
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[0];
  const interactiveAccentColor = theme.color.interactive[3];
  const analytics = useAnalyticsContext();

  if (!cityZone) {
    return [];
  }

  const actionButtons: ActionButton[] = [];
  const orderUrl = getTextForLanguage(cityZone.orderUrl, language);
  if (orderUrl) {
    actionButtons.push({
      id: `book_online_action`,
      text: t(CityBoxMessageTexts.actionButtons.bookOnline),
      icon: ExternalLink,
      interactiveColor: interactiveColor,
      accessibilityHint: t(CityBoxMessageTexts.a11yHintForExternalContent),
      onPress: () => {
        analytics.logEvent('Flexible transport', 'Book online url opened', {
          name: 'book_online_action',
          orderUrl: orderUrl,
        });
        Linking.openURL(orderUrl);
      },
    });
  }

  const phoneNumber = cityZone.phoneNumber;
  if (phoneNumber && !orderUrl) {
    actionButtons.push({
      id: `book_by_phone_action`,
      icon: Phone,
      text: t(CityBoxMessageTexts.actionButtons.bookByPhone),
      interactiveColor: interactiveColor,
      accessibilityHint: t(CityBoxMessageTexts.a11yHintForPhone),
      onPress: () => {
        analytics.logEvent('Flexible transport', 'Book by phone url opened', {
          name: 'book_by_phone_action',
          phoneNumber: phoneNumber,
        });
        Linking.openURL(`tel:${phoneNumber}`);
      },
    });
  }

  const moreInfoUrl = getTextForLanguage(cityZone.moreInfoUrl, language);
  if (moreInfoUrl && moreInfoUrl) {
    actionButtons.push({
      id: `more_info_action`,
      icon: ExternalLink,
      text: t(CityBoxMessageTexts.actionButtons.moreInfo),
      interactiveColor: interactiveAccentColor,
      accessibilityHint: t(CityBoxMessageTexts.a11yHintForExternalContent),
      onPress: () => {
        analytics.logEvent('Flexible transport', 'More info url opened', {
          name: 'more_info_action',
          moreInfoUrl: moreInfoUrl,
        });
        Linking.openURL(moreInfoUrl);
      },
    });
  }

  return actionButtons;
};

export const useStyle = StyleSheet.createThemeHook((theme) => ({
  cityZoneMessage: {
    marginTop: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
  },
  container: {
    padding: theme.spacing.medium,
    borderRadius: theme.border.radius.regular,
    flexDirection: 'row',
  },
  icon: {
    marginRight: theme.spacing.medium,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  message: {
    paddingRight: theme.spacing.small,
  },
  action: {
    marginTop: theme.spacing.medium,
    marginRight: theme.spacing.medium,
  },
  actions: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
}));
