// Code by Ben Awad
// from https://github.com/benawad/drag-n-drop-flatlist/blob/master/SortableList.tsx
import * as React from 'react';
import {Dimensions, LayoutChangeEvent, ViewStyle} from 'react-native';
import {State} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';

// @TODO
// Rewrite implementation to be modern components
// and handle state better.

const {cond, eq, add, call, Value, event, or} = Animated;

interface Props<T> {
  rowHeight: number;
  data: T[];
  containerStyle?: ViewStyle;
  indexToKey: (index: number) => string;
  renderRow: (
    data: T,
    index: number,
    state: 'normal' | 'dragging' | 'placeholder',
    dragEvent: any,
  ) => JSX.Element | null;
  onSort: (newData: T[]) => void;
}

interface RState {
  dataProvider: DataProvider;
  dragging: boolean;
  draggingIdx: number;
  rowHeight: number;
}

function immutableMove<T>(arr: T[], from: number, to: number) {
  return arr.reduce<T[]>((prev, current, idx, self) => {
    if (from === to) {
      prev.push(current);
    }
    if (idx === from) {
      return prev;
    }
    if (from < to) {
      prev.push(current);
    }
    if (idx === to) {
      prev.push(self[from]);
    }
    if (from > to) {
      prev.push(current);
    }
    return prev;
  }, []);
}

export class SortableList<T> extends React.PureComponent<Props<T>, RState> {
  list = React.createRef<RecyclerListView<any, any>>();
  _layoutProvider!: LayoutProvider;
  rowCenterY!: Animated.Node<number>;
  absoluteY = new Value(0);
  gestureState = new Value(-1);
  onGestureEvent: any;
  halfRowHeightValue!: Animated.Value<number>;
  currIdx = -1;
  scrollOffset = 0;
  flatlistHeight = 0;
  topOffset = 0;
  scrolling = false;

  constructor(props: Props<T>) {
    super(props);

    this.onGestureEvent = event([
      {
        nativeEvent: {
          absoluteY: this.absoluteY,
          state: this.gestureState,
        },
      },
    ]);

    this.setRowHeight(props.rowHeight, false);

    const dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    }, props.indexToKey);

    this.state = {
      dataProvider: dataProvider.cloneWithRows(props.data),
      dragging: false,
      draggingIdx: -1,
      rowHeight: props.rowHeight,
    };
  }

  setRowHeight(rowHeight: number, saveState: boolean) {
    this.halfRowHeightValue = new Value(-rowHeight / 2);
    this.rowCenterY = add(this.absoluteY, this.halfRowHeightValue);
    const {width} = Dimensions.get('window');

    this._layoutProvider = new LayoutProvider(
      (index) => {
        return 1;
      },
      (type, dim) => {
        dim.width = width;
        dim.height = rowHeight;
      },
    );
    if (saveState) {
      this.setState({
        rowHeight,
      });
    }
  }

  componentDidUpdate(prevProps: Props<T>) {
    if (prevProps.data !== this.props.data) {
      this.setState({
        dataProvider: this.state.dataProvider.cloneWithRows(this.props.data),
      });
    }

    if (prevProps.rowHeight !== this.props.rowHeight) {
      this.setRowHeight(this.props.rowHeight, true);
    }
  }

  handleScroll = (_a: unknown, _b: unknown, offsetY: number) => {
    this.scrollOffset = offsetY;
  };

  handleLayout = (e: LayoutChangeEvent) => {
    this.flatlistHeight = e.nativeEvent.layout.height;
    this.topOffset = e.nativeEvent.layout.y;
  };

  yToIndex = (y: number) =>
    Math.min(
      this.state.dataProvider.getSize() - 1,
      Math.max(
        0,
        Math.floor(
          (y + this.scrollOffset - this.topOffset) / this.props.rowHeight,
        ),
      ),
    );

  reset = () => {
    this.setState({
      dragging: false,
      draggingIdx: -1,
    });
    this.scrolling = false;
    this.currIdx = -1;
    const newData = this.state.dataProvider.getAllData();
    this.props.onSort(newData);
  };

  start = ([y]: readonly 0[]) => {
    this.currIdx = this.yToIndex(y);
    this.setState({dragging: true, draggingIdx: this.currIdx});
  };

  updateOrder = (y: number) => {
    const newIdx = this.yToIndex(y);
    if (this.currIdx !== newIdx) {
      this.setState({
        dataProvider: this.state.dataProvider.cloneWithRows(
          immutableMove(
            this.state.dataProvider.getAllData(),
            this.currIdx,
            newIdx,
          ),
        ),
        draggingIdx: newIdx,
      });
      this.currIdx = newIdx;
    }
  };

  moveList = (amount: number) => {
    if (!this.scrolling) {
      return;
    }

    this.list.current?.scrollToOffset(
      this.scrollOffset + amount,
      this.scrollOffset + amount,
      false,
    );

    requestAnimationFrame(() => {
      this.moveList(amount);
    });
  };

  move = ([y]: readonly 0[]) => {
    if (y + 100 > this.flatlistHeight) {
      if (!this.scrolling) {
        this.scrolling = true;
        this.moveList(20);
      }
    } else if (y < 100) {
      if (!this.scrolling) {
        this.scrolling = true;
        this.moveList(-20);
      }
    } else {
      this.scrolling = false;
    }
    this.updateOrder(y);
  };

  _rowRenderer = (type: any, data: T, index: number) => {
    return this.props.renderRow(
      data,
      index,
      this.state.draggingIdx === index ? 'placeholder' : 'normal',
      this.onGestureEvent,
    );
  };

  render() {
    const {dragging, dataProvider, draggingIdx} = this.state;

    return (
      <>
        <Animated.Code>
          {() =>
            cond(
              eq(this.gestureState, State.BEGAN),
              call([this.absoluteY], this.start),
            )
          }
        </Animated.Code>
        <Animated.Code>
          {() =>
            cond(
              or(
                eq(this.gestureState, State.END),
                eq(this.gestureState, State.CANCELLED),
                eq(this.gestureState, State.FAILED),
                eq(this.gestureState, State.UNDETERMINED),
              ),
              call([], this.reset),
            )
          }
        </Animated.Code>
        <Animated.Code>
          {() =>
            cond(
              eq(this.gestureState, State.ACTIVE),
              call([this.absoluteY], this.move),
            )
          }
        </Animated.Code>
        {dragging ? (
          <Animated.View
            style={{
              top: this.rowCenterY,
              position: 'absolute',
              width: '100%',
              zIndex: 99,
              elevation: 99,
            }}
          >
            {this.props.renderRow(
              dataProvider.getDataForIndex(draggingIdx),
              draggingIdx,
              'dragging',
              null,
            )}
          </Animated.View>
        ) : null}
        <RecyclerListView
          ref={this.list}
          style={{flex: 1, ...this.props.containerStyle}}
          onScroll={this.handleScroll}
          onLayout={this.handleLayout}
          layoutProvider={this._layoutProvider}
          dataProvider={dataProvider}
          rowRenderer={this._rowRenderer}
          extendedState={{dragging: true}}
        />
      </>
    );
  }
}
