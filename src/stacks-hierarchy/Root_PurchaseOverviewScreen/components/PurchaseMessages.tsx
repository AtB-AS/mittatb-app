import {MessageBox} from '@atb/components/message-box';
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

  const inspectableTokenWarningText = useOtherDeviceIsInspectableWarning();

  return (
    <>
      {inspectableTokenWarningText && (
        <MessageBox
          type="warning"
          message={inspectableTokenWarningText}
          isMarkdown={true}
        />
      )}

      {requiresTokenOnMobile && (
        <MessageBox
          type="info"
          message={t(PurchaseOverviewTexts.summary.messageRequiresMobile)}
          isMarkdown={true}
          subtle={true}
        />
      )}
    </>
  );
};
