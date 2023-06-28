import {Popover, PopoverProps} from './Popover';

type OnboardingId = 'mobility' | 'recent-fare-contracts';

type Props = Omit<PopoverProps, 'isOpen'> & {id: OnboardingId};

export const OnboardingPopover = (props: Props) => {
  return <Popover {...props} />;
};
