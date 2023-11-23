import React, {createContext, useCallback, useContext, useState} from 'react';
import {ToolTipKey} from './types';
import {OneTimeToolTip} from './OneTimeToolTip';
import {TOOLTIP_ANIMATION_DURATION} from './ToolTip';

type ToolTip = {
  from: React.RefObject<JSX.Element | null>;
  oneTimeKey: ToolTipKey | undefined;
};

export type ToolTipContextType = {
  current: ToolTip | undefined;
  addToolTip: (toolTip: ToolTip) => void;
  onToolTipClose: (oneTimeKey: ToolTipKey) => void;
};

const ToolTipContext = createContext<ToolTipContextType>({
  current: undefined,
  addToolTip: () => {},
  onToolTipClose: () => {},
});

export const ToolTipContextProvider: React.FC = ({children}) => {
  // Queue of tooltips to display
  const [toolTips, setToolTips] = useState<ToolTip[]>([]);

  const addToolTip = useCallback((toolTip: ToolTip) => {
    setToolTips((val) => [...val, toolTip]);
  }, []);

  const onToolTipClose = useCallback(() => {
    // Remove the first tooltip from the queue after the close animation has finished.
    setTimeout(
      () =>
        setToolTips((val) => {
          const [_, ...rest] = val;
          return rest;
        }),
      TOOLTIP_ANIMATION_DURATION,
    );
  }, []);

  return (
    <ToolTipContext.Provider
      value={{current: toolTips[0], addToolTip, onToolTipClose}}
    >
      {toolTips[0] && toolTips[0].oneTimeKey && (
        <OneTimeToolTip
          key={toolTips[0].oneTimeKey}
          from={toolTips[0].from}
          oneTimeKey={toolTips[0].oneTimeKey}
          enabled={true}
          onClose={onToolTipClose}
        />
      )}
      {children}
    </ToolTipContext.Provider>
  );
};

export function useToolTipContext() {
  const context = useContext(ToolTipContext);
  if (context === undefined) {
    throw new Error(
      'ToolTipContext must be used within a ToolTipContextProvider',
    );
  }
  return context;
}
