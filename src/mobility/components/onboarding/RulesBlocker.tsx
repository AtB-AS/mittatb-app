import {FullScreenView} from '@atb/components/screen-view';

export type RulesBlockerProps = {};

export const RulesBlocker = ({}: RulesBlockerProps) => {
  return (
    <FullScreenView
      headerProps={{
        rightButton: {type: 'close', withIcon: true},
      }}
    >
      <></>
    </FullScreenView>
  );
};
