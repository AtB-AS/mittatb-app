import {ToolTip} from './ToolTip';
import {storage, StorageModelKeysEnum} from '@atb/storage';
import React, {useEffect, useState} from 'react';
import {ToolTipKey} from './types';
import {useTranslation} from '@atb/translations';
import OneTimeToolTipTexts from '@atb/translations/components/OneTimeToolTip';

export type Props = {
  from: React.RefObject<JSX.Element | null>;
  oneTimeKey: ToolTipKey;
  enabled: boolean;
};

export const OneTimeToolTip = (props: Props) => {
  const [toolTips, setToolTips] = useState<string[]>();
  const isVisible =
    props.enabled && toolTips && !toolTips.includes(props.oneTimeKey);
  const {t} = useTranslation();

  useEffect(() => {
    getSeenToolTips().then(setToolTips);
  }, []);

  /**
   * Fetches from storage the list of one time tool tips already seen by the user
   */
  const getSeenToolTips = () =>
    storage
      .get(StorageModelKeysEnum.OneTimeToolTip)
      .then((stored) => JSON.parse(stored ?? '[]') as string[]);

  const setToolTipsRead = () => {
    getSeenToolTips().then((seen) => {
      const newSeen = (seen ?? [])
        .filter((f) => f !== props.oneTimeKey)
        .concat(props.oneTimeKey);
      storage.set(StorageModelKeysEnum.OneTimeToolTip, JSON.stringify(newSeen));
      setToolTips(newSeen);
    });
  };

  return (
    <ToolTip
      {...props}
      heading={t(OneTimeToolTipTexts[props.oneTimeKey].heading)}
      text={t(OneTimeToolTipTexts[props.oneTimeKey].text)}
      isOpen={isVisible}
      onClose={setToolTipsRead}
    />
  );
};
