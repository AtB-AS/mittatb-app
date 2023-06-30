import {ToolTipProps, ToolTip} from './ToolTip';
import {storage, StorageModelKeysEnum} from '@atb/storage';
import {useEffect, useState} from 'react';

type Props = Omit<ToolTipProps, 'isOpen'> & {oneTimeKey: string};

export const OneTimeToolTip = (props: Props) => {
  const [toolTips, setToolTips] = useState<string[]>();
  const isVisible = toolTips && !toolTips.includes(props.oneTimeKey);

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
    if (props.onClose) props.onClose();
  };

  return (
    <ToolTip
      {...props}
      heading={props.heading}
      text={props.text}
      isOpen={isVisible}
      onClose={setToolTipsRead}
    />
  );
};
