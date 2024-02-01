import React from 'react';
import {Button} from '@atb/components/button';
import {Filter} from '@atb/assets/svg/mono-icons/actions';
import {useAnalytics} from '@atb/analytics';
import {ShadowWrapper} from '@atb/components/map';

type MapFilterProps = {
  onPress: () => void;
  isLoading: boolean;
};
export const MapFilter = ({onPress, isLoading}: MapFilterProps) => {
  const analytics = useAnalytics();

  return (
    <ShadowWrapper>
      <Button
        type="medium"
        compact={true}
        interactiveColor="interactive_2"
        accessibilityRole="button"
        onPress={() => {
          analytics.logEvent('Map', 'Filter button clicked');
          onPress();
        }}
        loading={isLoading}
        rightIcon={{svg: Filter}}
      />
    </ShadowWrapper>
  );
};
