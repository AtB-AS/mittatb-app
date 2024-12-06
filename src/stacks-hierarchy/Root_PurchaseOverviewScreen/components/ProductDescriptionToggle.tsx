import {Toggle} from '@atb/components/toggle';
import {ThemeText} from '@atb/components/text';
import {usePreferences} from '@atb/preferences';
import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';

export function ProductDescriptionToggle({title}: {title: string}) {
  const styles = useStyles();
  const {t} = useTranslation();
  const {
    setPreference,
    preferences: {hideProductDescriptions: hideDescriptions},
  } = usePreferences();

  return (
    <View style={styles.container}>
      <View style={{flexShrink: 1}}>
        <ThemeText typography="body__secondary" color="secondary">
          {title}
        </ThemeText>
      </View>

      <View style={styles.switchAndLabel}>
        <ThemeText
          typography="body__secondary"
          accessible={false}
          importantForAccessibility="no"
          style={styles.label}
        >
          {t(PurchaseOverviewTexts.productSelection.descriptionToggle.label)}
        </ThemeText>
        <Toggle
          value={!hideDescriptions}
          onValueChange={(checked) => {
            setPreference({hideProductDescriptions: !checked});
          }}
          accessibilityLabel={t(
            PurchaseOverviewTexts.productSelection.descriptionToggle.a11yLabel,
          )}
          testID="descriptionToggle"
        />
      </View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.medium,
      marginHorizontal: theme.spacing.medium,
      alignItems: 'center',
    },
    switchAndLabel: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    label: {marginRight: theme.spacing.xSmall},
  };
});
