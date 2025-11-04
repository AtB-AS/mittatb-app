import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {StyleProp, View, ViewStyle} from 'react-native';
import {FareProductTypeConfig} from '@atb/modules/configuration';
import React, {forwardRef} from 'react';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {TransportationIconBoxList} from '@atb/components/icon-box';
import {Button} from '@atb/components/button';
import {Info} from '@atb/assets/svg/mono-icons/status';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

type Props = {
  fareProductTypeConfig: FareProductTypeConfig;
  onTicketInfoButtonPress: () => void;
  style?: StyleProp<ViewStyle>;
};
export const FareProductHeader = forwardRef<View, Props>(
  ({fareProductTypeConfig, onTicketInfoButtonPress, style}: Props, ref) => {
    const {t, language} = useTranslation();
    const {theme} = useThemeContext();
    const themeColor = theme.color.background.accent[0];
    const styles = useStyle();
    const {isTicketInformationEnabled} = useFeatureTogglesContext();

    return (
      <View style={style}>
        <View style={styles.header} ref={ref} accessible={true}>
          <TransportationIconBoxList
            modes={fareProductTypeConfig.transportModes}
            iconSize="normal"
          />
          <ThemeText
            typography="heading__l"
            color={themeColor}
            style={styles.headerText}
          >
            {getTextForLanguage(fareProductTypeConfig.name, language) ?? ''}
          </ThemeText>
        </View>
        {isTicketInformationEnabled && (
          <View style={styles.headerSubSection}>
            <Button
              expanded={false}
              type="small"
              mode="secondary"
              leftIcon={{svg: Info}}
              interactiveColor={theme.color.interactive[0]}
              text={t(PurchaseOverviewTexts.ticketInformation.button)}
              onPress={onTicketInfoButtonPress}
              testID="ticketInformationButton"
              backgroundColor={themeColor}
            />
          </View>
        )}
      </View>
    );
  },
);
const useStyle = StyleSheet.createThemeHook((theme) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flexShrink: 1,
  },
  headerSubSection: {
    paddingTop: theme.spacing.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  icon: {
    marginRight: theme.spacing.small,
  },
  ticketDescription: {
    flexShrink: 1,
    marginRight: theme.spacing.medium,
  },
}));
