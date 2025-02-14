import {MessageInfoBox} from '@atb/components/message-info-box';
import React from 'react';
import {useOtherDeviceIsInspectableWarning} from '@atb/modules/fare-contracts';

export const PurchaseMessage = () => {
  const inspectableTokenWarningText = useOtherDeviceIsInspectableWarning();

  return inspectableTokenWarningText ? (
    <MessageInfoBox
      type="warning"
      message={inspectableTokenWarningText}
      isMarkdown={true}
    />
  ) : null;
};
