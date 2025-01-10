import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {StyleProp, View, ViewStyle} from 'react-native';
import {
  FareProductTypeConfig,
  PreassignedFareProduct,
} from '@atb/configuration';
import React, {forwardRef} from 'react';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {TransportationIconBoxList} from '@atb/components/icon-box';
import {Button} from '@atb/components/button';
import {Info} from '@atb/assets/svg/mono-icons/status';
import {stripMarkdown} from '@atb/components/text';
import {useFeatureTogglesContext} from '@atb/feature-toggles';

type Props = {
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
  onTicketInfoButtonPress: () => void;
  style?: StyleProp<ViewStyle>;
};
export const FareProductHeader = forwardRef<View, Props>(
  (
    {
      fareProductTypeConfig,
      preassignedFareProduct,
      onTicketInfoButtonPress,
      style,
    }: Props,
    ref,
  ) => {
    const {t, language} = useTranslation();
    const {theme} = useThemeContext();
    const themeColor = theme.color.background.accent[0];
    const styles = useStyle();
    const {isTicketInformationEnabled} = useFeatureTogglesContext();

    const productDescription = stripMarkdown(
      getTextForLanguage(
        preassignedFareProduct.productDescription ?? [],
        language,
      ) ?? '',
    );

    return (
      <View style={style}>
        <View style={styles.header} ref={ref} accessible={true}>
          <TransportationIconBoxList
            modes={fareProductTypeConfig.transportModes}
            iconSize="normal"
          />
          <ThemeText
            typography="heading--medium"
            color={themeColor}
            style={styles.headerText}
          >
            {getTextForLanguage(fareProductTypeConfig.name, language) ?? ''}
          </ThemeText>
        </View>
        {isTicketInformationEnabled && (
          <View style={styles.headerSubSection}>
            <ThemeText
              typography="body__secondary"
              color={themeColor}
              style={styles.ticketDescription}
              numberOfLines={1}
            >
              {productDescription}
            </ThemeText>
            <Button
              expanded={false}
              type="small"
              leftIcon={{svg: Info}}
              interactiveColor={theme.color.interactive[1]}
              text={t(PurchaseOverviewTexts.ticketInformation.button)}
              onPress={onTicketInfoButtonPress}
              testID="ticketInformationButton"
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
    marginTop: theme.spacing.medium,
    borderTopWidth: theme.border.width.slim,
    borderTopColor: theme.color.background.accent[1].background,
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
