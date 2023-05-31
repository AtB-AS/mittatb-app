// interface for `ScrollContext`
import {createContext, useContext, useState} from 'react';
import {ScrollView as ScrollViewNative, ScrollViewProps} from 'react-native';

export interface ScrollContextInterface {
  opacity: number;
  maxOffset: number;
  offset: number;
  titleShowing: boolean;
  updateOffset(val: number): void;
}

export interface ChildProps {
  children: any;
}

const withinLimits = (val: number, min: number, max: number): number =>
  val > max ? max : val < min ? min : val;

export const ScrollContext = createContext<ScrollContextInterface>({
  opacity: 0,
  maxOffset: 0,
  offset: 0,
  titleShowing: false,
  updateOffset: () => {},
});

export const useScroller = () => useContext(ScrollContext);

export const ScrollContextProvider = (props: ChildProps) => {
  const minOffset: number = 0;
  const maxOffset: number = 100;

  const [offset, setOffset] = useState(0);
  const [titleShowing, setTitleShowing] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const updateOffset = (val: number) => {
    setOffset(withinLimits(val, minOffset, maxOffset));
    setTitleShowing(val > maxOffset);
    setOpacity(withinLimits((val * maxOffset) / 1000, 0, 1));
  };

  return (
    <ScrollContext.Provider
      value={{
        opacity: opacity,
        maxOffset: maxOffset,
        offset: offset,
        titleShowing: titleShowing,
        updateOffset: updateOffset,
      }}
    >
      {props.children}
    </ScrollContext.Provider>
  );
};

export const ScrollView = (props?: ChildProps & ScrollViewProps) => {
  const {updateOffset} = useScroller();

  return (
    <ScrollViewNative
      {...props}
      onScroll={({nativeEvent}) => {
        updateOffset(nativeEvent.contentOffset.y);
      }}
      scrollEventThrottle={200}
    >
      {props?.children}
    </ScrollViewNative>
  );
};
