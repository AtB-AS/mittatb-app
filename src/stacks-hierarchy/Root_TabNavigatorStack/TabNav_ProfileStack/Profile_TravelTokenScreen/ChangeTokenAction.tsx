import {TravelTokenTexts, useTranslation} from '@atb/translations';
import {useMobileTokenContextState} from '@atb/mobile-token';
import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Swap} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet, Theme} from '@atb/theme';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {TokenToggleInfoComponent} from '@atb/token-toggle-info';

const ChangeTokenAction = ({
  onChange,
  toggleLimit,
}: {
  onChange: () => void;
  toggleLimit?: number;
}) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {mobileTokenStatus} = useMobileTokenContextState();
  const {disable_travelcard} = useRemoteConfig();

  return (
    <Section style={styles.changeTokenButton}>
      <LinkSectionItem
        type="spacious"
        text={
          disable_travelcard
            ? t(TravelTokenTexts.travelToken.changeTokenWithoutTravelcardButton)
            : t(TravelTokenTexts.travelToken.changeTokenButton)
        }
        disabled={mobileTokenStatus !== 'success' || toggleLimit === 0}
        onPress={onChange}
        testID="switchTokenButton"
        icon={<ThemeIcon svg={Swap} />}
      />

      {toggleLimit !== undefined && (
        <GenericSectionItem>
          <TokenToggleInfoComponent style={styles.tokenInfoView} />
        </GenericSectionItem>
      )}
    </Section>
  );
};

export {ChangeTokenAction};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  changeTokenButton: {
    marginBottom: theme.spacings.medium,
  },
  loader: {alignSelf: 'center', flex: 1},
  tokenInfoView: {flexDirection: 'row'},
  tokenInfo: {marginLeft: theme.spacings.xSmall, flex: 1},
}));
