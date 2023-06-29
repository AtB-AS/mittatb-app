import {Popover, PopoverProps} from './Popover';
import {storage, StorageModelKeysEnum} from '@atb/storage';
import {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';

type Props = Omit<PopoverProps, 'isOpen'> & {onboardingKey: string};

export const OnboardingPopover = (props: Props) => {
  const [onboardings, setOnboardings] = useState<string[]>();
  const isVisible = onboardings && !onboardings.includes(props.onboardingKey);

  useEffect(() => {
    getSeenOnboardings().then(setOnboardings);
  }, []);

  /**
   * Fetches from storage the list of one time popovers already seen by the user
   */
  const getSeenOnboardings = () =>
    storage
      .get(StorageModelKeysEnum.OnboardingPopover)
      .then((stored) => JSON.parse(stored ?? '[]') as string[]);

  const setOnboardingRead = () => {
    getSeenOnboardings().then((seen) => {
      const newSeen = (seen ?? [])
        .filter((f) => f !== props.onboardingKey)
        .concat(props.onboardingKey);
      storage.set(
        StorageModelKeysEnum.OnboardingPopover,
        JSON.stringify(newSeen),
      );
      setOnboardings(newSeen);
    });
    if (props.onClose) props.onClose();
  };

  return (
    <Popover
      {...props}
      heading={props.heading}
      text={props.text}
      isOpen={isVisible}
      onClose={setOnboardingRead}
    />
  );
};
