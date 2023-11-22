import React, {createContext, useCallback, useContext, useState} from 'react';
import {ToolTipKey} from './types';

type ToolTip = {
  from: React.RefObject<JSX.Element | null>;
  oneTimeKey: ToolTipKey | undefined;
};

export type ToolTipContextType = {
  current: ToolTip | undefined;
  addToolTip: (toolTip: ToolTip) => void;
};

const ToolTipContext = createContext<ToolTipContextType>({
  current: undefined,
  addToolTip: () => {},
});

export const ToolTipContextProvider: React.FC = ({children}) => {
  const [current, setCurrent] = useState<ToolTip>();

  const addToolTip = useCallback((toolTip: ToolTip) => {
    console.log('Setting current tooltip: ', toolTip);
    setCurrent(toolTip);
  }, []);

  return (
    <ToolTipContext.Provider value={{current, addToolTip}}>
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
