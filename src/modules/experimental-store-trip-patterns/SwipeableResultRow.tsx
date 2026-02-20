import {useThemeContext} from '@atb/theme';
import React, {useCallback, useMemo} from 'react';
import Swipeable, {
  SwipeableMethods,
  SwipeDirection,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {SharedValue, useAnimatedStyle} from 'react-native-reanimated';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Delete, Save} from '@atb/assets/svg/mono-icons/actions';
import {SvgProps} from 'react-native-svg';

export type RightActionKind = 'delete' | 'save';

export const SwipeableResultRow: React.FC<
  React.PropsWithChildren<{
    onRightAction: (actionKind: RightActionKind) => void;
    swipeableRef: React.RefObject<SwipeableMethods | null>;
    rightActionKind: RightActionKind;
  }>
> = ({children, onRightAction, swipeableRef, rightActionKind}) => {
  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      if (direction === 'left') {
        onRightAction(rightActionKind);
      }
    },
    [onRightAction, rightActionKind],
  );

  const RightAction = useMemo(() => {
    if (rightActionKind === 'delete') {
      return RightActionDelete;
    }
    return RightActionSave;
  }, [rightActionKind]);

  return (
    <Swipeable
      ref={swipeableRef}
      friction={1}
      overshootFriction={8}
      enableTrackpadTwoFingerGesture
      rightThreshold={20}
      renderRightActions={RightAction}
      onSwipeableOpen={handleSwipe}
    >
      {children}
    </Swipeable>
  );
};

const ACTION_WIDTH = 80;

const wrapWithRightActionIcon = (
  icon: (props: SvgProps) => React.JSX.Element,
) =>
  function RightActionWithIcon(
    prog: SharedValue<number>,
    drag: SharedValue<number>,
  ) {
    const {theme} = useThemeContext();
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{translateX: drag.value + ACTION_WIDTH}],
      };
    });

    return (
      <Animated.View
        style={[
          {
            width: ACTION_WIDTH,
            paddingRight: theme.spacing.xLarge, // This is to make the icon center aligned, the result row has a padding right of theme.spacing.medium
            justifyContent: 'center',
            alignItems: 'center',
          },
          styleAnimation,
        ]}
      >
        <ThemeIcon svg={icon} size="large" />
      </Animated.View>
    );
  };

const RightActionDelete = wrapWithRightActionIcon(Delete);
const RightActionSave = wrapWithRightActionIcon(Save);
