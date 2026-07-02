import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TravelCardSkeleton} from './TravelCardSkeleton';

type Props = {
  children?: (props: {onReady: () => void}) => React.ReactNode;
};

export const WithTravelCardSkeleton = ({children}: Props) => {
  const [ready, setReady] = useState(false);
  const showSkeleton = !children || !ready;

  return (
    <View>
      {showSkeleton && <TravelCardSkeleton />}
      {children ? (
        <View
          style={!ready ? styles.measuring : undefined}
          pointerEvents={ready ? 'auto' : 'none'}
          accessibilityElementsHidden={!ready}
          importantForAccessibility={ready ? 'auto' : 'no-hide-descendants'}
        >
          {children({onReady: () => setReady(true)})}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  // Real card laid out but out of flow + invisible while its legs measure; the
  // skeleton holds the visible slot until measurement completes.
  measuring: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    opacity: 0,
  },
});
