import React from 'react';
import {StyleSheet, Theme} from '@atb/theme';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {TokenToggleInfo} from '@atb/token-toggle-info';
import {useTokenToggleDetailsQuery} from '@atb/mobile-token/use-token-toggle-details';

const ChangeTokenAction = () => {
  const styles = useStyles();
  const {data} = useTokenToggleDetailsQuery();

  return (
    <Section style={styles.changeTokenSection}>
      {data?.toggleLimit !== undefined && (
        <GenericSectionItem>
          <TokenToggleInfo style={styles.tokenInfoView} />
        </GenericSectionItem>
      )}
    </Section>
  );
};

export {ChangeTokenAction};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  changeTokenSection: {
    marginBottom: theme.spacings.medium,
  },
  tokenInfoView: {flexDirection: 'row'},
}));
