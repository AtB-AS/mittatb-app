import {
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import {v4 as uuid} from 'uuid';

const resetFunctions: Array<() => void> = [];

export const resetTestIdPrototypes = () => {
  while (resetFunctions.length) {
    const cb = resetFunctions.pop();
    cb?.();
  }
};

export const setTestIdPrototypes = () => {
  if (resetFunctions.length) return;

  resetFunctions.push(
    overrideRenderWithToolTip(TouchableWithoutFeedback, fragmentWrapper),
    overrideRenderWithToolTip(View, viewWrapper),
    overrideRenderWithToolTip(ScrollView, viewWrapper),
    overrideRenderWithToolTip(Switch, fragmentWrapper),
    overrideRenderWithToolTip(TextInput, fragmentWrapper),
    overrideRenderWithToolTip(Text, fragmentWrapper),
  );
};

function overrideRenderWithToolTip(
  component: any,
  wrapper: (
    tooltip: React.ReactElement,
    children: React.ReactNode,
  ) => React.ReactElement,
) {
  const originalRender = component.render;

  component.render = function render() {
    if (arguments[0]?.testID) {
      const {testID} = arguments[0];

      return wrapper(
        testIdTooltip(testID),
        originalRender.apply(this, arguments),
      );
    }

    return originalRender.apply(this, arguments);
  };

  return function resetRender() {
    component.render = originalRender;
  };
}

function testIdTooltip(testId: string): React.ReactElement {
  const text = React.createElement(
    Text,
    {
      style: {
        color: 'black',
        fontSize: 12,
        backgroundColor: 'red',
        padding: 2,
      },
      key: uuid(),
    },
    testId,
  );

  return React.createElement(
    View,
    {
      style: {position: 'absolute', top: -5, left: 0, zIndex: 1000},
      key: uuid(),
    },
    text,
  );
}

function fragmentWrapper(
  toolTip: React.ReactElement,
  children: React.ReactNode,
) {
  return React.createElement(
    React.Fragment,
    {
      key: uuid(),
    },
    [toolTip, children],
  );
}

function viewWrapper(toolTip: React.ReactElement, children: React.ReactNode) {
  return React.createElement(
    View,
    {
      style: [
        {
          borderWidth: 0.5,
          borderColor: 'red',
          zIndex: 1000,
        },
      ],
      key: uuid(),
    },
    [toolTip, children],
  );
}
