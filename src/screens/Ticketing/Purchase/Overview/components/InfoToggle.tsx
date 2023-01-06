import {FixedSwitch} from '@atb/components/switch';
import {ThemeText} from '@atb/components/text';
import {usePreferences} from '@atb/preferences';
import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';

export default function InfoToggle({
  title,
  accessibilityLabel,
}: {
  title: string;
  accessibilityLabel?: string;
}) {
  const styles = useStyles();
  const {t} = useTranslation();
  const {
    setPreference,
    preferences: {hideTravellerDescriptions: hideDescriptions},
  } = usePreferences();

  return (
    <View style={styles.container}>
      <View style={{flexShrink: 1}}>
        <ThemeText type="body__secondary" color="secondary">
          {title}
        </ThemeText>
      </View>

      <View style={styles.switchAndLabel}>
        <ThemeText
          type="body__secondary"
          accessible={false}
          importantForAccessibility="no"
          style={styles.label}
        >
          {t(PurchaseOverviewTexts.infoToggle.label)}
        </ThemeText>
        <FixedSwitch
          value={!hideDescriptions}
          onValueChange={(checked) => {
            setPreference({hideTravellerDescriptions: !checked});
          }}
          accessibilityLabel={accessibilityLabel}
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
      marginBottom: theme.spacings.medium,
      alignItems: 'center',
    },
    switchAndLabel: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    label: {marginRight: theme.spacings.xSmall},
  };
});
