import React, {createContext, useCallback, useContext, useState} from 'react';
import {ToolTipKey} from './types';
import {ToolTip} from './ToolTip';
import {useOneTimeToolTips} from './use-one-time-tool-tips';
import OneTimeToolTipTexts from '@atb/translations/components/OneTimeToolTip';
import {useTranslation} from '@atb/translations';

export const TOOLTIP_ANIMATION_DURATION = 200;

type ToolTip = {
  target: React.RefObject<JSX.Element | null>;
  oneTimeKey: ToolTipKey;
};

export type ToolTipContextType = {
  addToolTip: (toolTip: ToolTip) => void;
};

const ToolTipContext = createContext<ToolTipContextType>({
  addToolTip: () => {},
});

export const ToolTipContextProvider: React.FC = ({children}) => {
  // Queue of tooltips to display
  const [toolTips, setToolTips] = useState<ToolTip[]>([]);
  const {isSeen, setToolTipSeen} = useOneTimeToolTips();
  const {t} = useTranslation();
  const current = toolTips[0];

  const addToolTip = useCallback(
    (toolTip: ToolTip) => {
      if (!isSeen(toolTip.oneTimeKey)) {
        // Setting a timeout before adding the tool tip to allow potential page transitions
        // or similar animations to complete before the tool tip is displayed.
        setTimeout(() => {
          setToolTips((val) => [...val, toolTip]);
        }, 500);
      }
    },
    [isSeen],
  );

  const onToolTipClose = useCallback(
    async (oneTimeKey: ToolTipKey) => {
      await setToolTipSeen(oneTimeKey);
      // Remove the first tooltip from the queue after the close animation has finished.
      setTimeout(
        () =>
          setToolTips((val) => {
            const [_, ...rest] = val;
            return rest;
          }),
        TOOLTIP_ANIMATION_DURATION,
      );
    },
    [setToolTipSeen],
  );

  return (
    <ToolTipContext.Provider value={{addToolTip}}>
      {current && (
        <ToolTip
          key={current.oneTimeKey}
          from={current.target}
          isOpen={!isSeen(current.oneTimeKey)}
          heading={t(OneTimeToolTipTexts[current.oneTimeKey].heading)}
          text={t(OneTimeToolTipTexts[current.oneTimeKey].text)}
          animationDuration={TOOLTIP_ANIMATION_DURATION}
          onClose={() => onToolTipClose(current.oneTimeKey)}
        />
      )}
      {children}
    </ToolTipContext.Provider>
  );
};

export function useToolTips() {
  const context = useContext(ToolTipContext);
  if (context === undefined) {
    throw new Error(
      'ToolTipContext must be used within a ToolTipContextProvider',
    );
  }
  return context;
}
