import {MessageBox} from '@atb/components/message-box';
import {StyleSheet} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {useOtherDeviceIsInspectableWarning} from '../../../fare-contracts/utils';

export type PurchaseWarningsProps = {
  requiresTokenOnMobile: boolean;
};

export const PurchaseMessages: React.FC<PurchaseWarningsProps> = ({
  requiresTokenOnMobile,
}) => {
  const {t} = useTranslation();
  const styles = useStyles();

  const inspectableTokenWarningText = useOtherDeviceIsInspectableWarning();

  return (
    <>
      {inspectableTokenWarningText && (
        <MessageBox
          type="warning"
          message={inspectableTokenWarningText}
          style={styles.warning}
          isMarkdown={true}
        />
      )}

      {requiresTokenOnMobile && (
        <MessageBox
          type="info"
          message={t(PurchaseOverviewTexts.summary.messageRequiresMobile)}
          style={styles.warning}
          isMarkdown={true}
          subtle={true}
        />
      )}
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  warning: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
}));
