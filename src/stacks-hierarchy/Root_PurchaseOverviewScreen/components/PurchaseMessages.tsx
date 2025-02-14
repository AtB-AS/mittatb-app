import {MessageInfoBox} from '@atb/components/message-info-box';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {MessageInfoText} from '@atb/components/message-info-text';
import {useOtherDeviceIsInspectableWarning} from '@atb/modules/fare-contracts';

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
        <MessageInfoBox
          type="warning"
          message={inspectableTokenWarningText}
          isMarkdown={true}
        />
      )}

      {requiresTokenOnMobile && (
        <MessageInfoText
          type="info"
          message={t(PurchaseOverviewTexts.summary.messageRequiresMobile)}
          isMarkdown={true}
        />
      )}
    </>
  );
};
