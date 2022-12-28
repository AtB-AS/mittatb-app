import {FixedSwitch} from '@atb/components/switch';
import {ThemeText} from '@atb/components/text';
import {usePreferences} from '@atb/preferences';
import useFontScale from '@atb/utils/use-font-scale';
import React from 'react';
import {View, Platform} from 'react-native';
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
    <View
      style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}
    >
      <View style={{flexGrow: 1}}>
        <ThemeText
          type="body__secondary"
          color="secondary"
          style={styles.title}
        >
          {title}
        </ThemeText>
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'flex-end',
        }}
      >
        <ThemeText
          type="body__secondary"
          accessible={false}
          importantForAccessibility="no"
        >
          {t(PurchaseOverviewTexts.infoToggle.label)}
        </ThemeText>
        <FixedSwitch
          style={[
            styles.toggle,
            Platform.OS === 'android' ? styles.androidToggle : styles.iosToggle,
          ]}
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
  const scale = useFontScale();
  return {
    title: {
      marginBottom: theme.spacings.medium,
    },
    toggle: {
      alignSelf: 'center',
    },
    androidToggle: {
      transform: [{scale: scale}, {translateY: -6}],
    },
    iosToggle: {
      marginLeft: theme.spacings.xSmall,
      transform: [{scale: 0.7 * scale}, {translateY: -10}],
    },
  };
});
