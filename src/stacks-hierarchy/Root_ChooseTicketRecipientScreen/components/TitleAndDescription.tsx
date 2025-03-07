import {
  OnBehalfOfTexts,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {ContrastColor} from '@atb/theme/colors';
import {StyleSheet} from '@atb/theme';
import {forwardRef} from 'react';
import React from 'react';

export const TitleAndDescription = forwardRef<any, {themeColor: ContrastColor}>(
  ({themeColor}, focusRef) => {
    const styles = useStyles();
    const {t} = useTranslation();
    return (
      <>
        <View accessible={true} accessibilityRole="header" ref={focusRef}>
          <ThemeText
            typography="heading--big"
            color={themeColor}
            style={styles.title}
          >
            {t(OnBehalfOfTexts.chooseReceiver.title)}
          </ThemeText>
        </View>
        <View accessible={true}>
          <ThemeText
            typography="body__primary"
            color={themeColor}
            style={styles.description}
          >
            {t(PurchaseOverviewTexts.onBehalfOf.sectionSubText)}
          </ThemeText>
        </View>
      </>
    );
  },
);

const useStyles = StyleSheet.createThemeHook((theme) => ({
  title: {marginTop: theme.spacing.medium, textAlign: 'center'},
  description: {
    textAlign: 'center',
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.xLarge,
  },
}));
