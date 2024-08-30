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
import {StyleSheet, useTheme} from '@atb/theme';
import {TransportationIconBoxList} from '@atb/components/icon-box';
import {Button} from '@atb/components/button';
import {Info} from '@atb/assets/svg/mono-icons/status';
import {useIsTicketInformationEnabled} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/use-is-ticket-information-enabled';
import {stripMarkdown} from '@atb/components/text';

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
    const {theme} = useTheme();
    const styles = useStyle();
    const [isTicketInformationEnabled] = useIsTicketInformationEnabled();

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
            iconSize="medium"
          />
          <ThemeText
            type="heading--medium"
            color="background_accent_0"
            style={styles.headerText}
          >
            {getTextForLanguage(fareProductTypeConfig.name, language) ?? ''}
          </ThemeText>
        </View>
        {isTicketInformationEnabled && (
          <View style={styles.headerSubSection}>
            <ThemeText
              type="body__secondary"
              color="background_accent_0"
              style={styles.ticketDescription}
              numberOfLines={1}
            >
              {productDescription}
            </ThemeText>
            <Button
              type="small"
              leftIcon={{svg: Info}}
              interactiveColor={theme.color.interactive[1]}
              text={t(PurchaseOverviewTexts.ticketInformation.button)}
              onPress={onTicketInfoButtonPress}
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
