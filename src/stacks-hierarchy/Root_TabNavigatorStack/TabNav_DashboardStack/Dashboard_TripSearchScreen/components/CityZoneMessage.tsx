import {StyleSheet, useTheme} from '@atb/theme';
import {
  Language,
  TranslateFunction,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {Linking, TouchableOpacity, View} from 'react-native';
import {FlexibleTransport} from '@atb/assets/svg/color/illustrations';
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
import {useFirestoreConfiguration} from '@atb/configuration';
import {InteractiveColor} from '@atb/theme/colors';
import {Phone} from '@atb/assets/svg/mono-icons/devices';
import {CityZone} from '@atb/reference-data/types';

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
  const {t, language} = useTranslation();
  const {cityZones} = useFirestoreConfiguration();
  const enabledCityZones = cityZones.filter((cityZone) => cityZone.enabled);
  const fromCityZone = useFindCityZoneInLocation(from, enabledCityZones);
  const toCityZone = useFindCityZoneInLocation(to, enabledCityZones);

  if (!fromCityZone || !toCityZone) {
    return null;
  }

  if (fromCityZone.id !== toCityZone.id) {
    return null;
  }

  const actionButtons = buildActionButtons(fromCityZone, t, language);

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
                key={actionButton.id}
                type="pill"
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

const buildActionButtons = (
  cityZone: CityZone,
  t: TranslateFunction,
  language: Language,
) => {
  const actionButtons: ActionButton[] = [];

  const orderUrl = getTextForLanguage(cityZone.orderUrl, language);
  if (orderUrl) {
    actionButtons.push({
      id: `book_online_action`,
      text: t(CityBoxMessageTexts.actionButtons.bookOnline),
      icon: ExternalLink,
      interactiveColor: 'interactive_0',
      accessibilityHint: t(CityBoxMessageTexts.a11yHintForExternalContent),
      onPress: () => Linking.openURL(orderUrl),
    });
  }

  const phoneNumber = cityZone.phoneNumber;
  if (phoneNumber && !orderUrl) {
    actionButtons.push({
      id: `book_by_phone_action`,
      icon: Phone,
      text: t(CityBoxMessageTexts.actionButtons.bookByPhone),
      interactiveColor: 'interactive_0',
      accessibilityHint: t(CityBoxMessageTexts.a11yHintForPhone),
      onPress: () => Linking.openURL(`tel:${phoneNumber}`),
    });
  }

  const moreInfoUrl = getTextForLanguage(cityZone.moreInfoUrl, language);
  if (moreInfoUrl && moreInfoUrl) {
    actionButtons.push({
      id: `more_info_action`,
      icon: ExternalLink,
      text: t(CityBoxMessageTexts.actionButtons.moreInfo),
      interactiveColor: 'interactive_3',
      accessibilityHint: t(CityBoxMessageTexts.a11yHintForExternalContent),
      onPress: () => Linking.openURL(moreInfoUrl),
    });
  }

  return actionButtons;
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
