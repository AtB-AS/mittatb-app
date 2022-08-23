import {StyleSheet} from '@atb/theme';
import {TicketTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import React from 'react';

const NonTicketInspectionSymbol = () => {
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <View style={styles.symbolContainerCircle}>
      <ThemeText
        type="body__tertiary"
        style={{
          textAlign: 'center',
        }}
        accessibilityLabel={t(TicketTexts.ticketInfo.noInspectionIconA11yLabel)}
      >
        {t(TicketTexts.ticketInfo.noInspectionIcon)}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  symbolContainerCircle: {
    borderRadius: 1000,
    borderColor: theme.static.status.warning.background,
    borderWidth: 5,
    justifyContent: 'center',
    aspectRatio: 1,
    padding: theme.spacings.small,
  },
}));

export default NonTicketInspectionSymbol;
