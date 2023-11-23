import React, {createContext, useCallback, useContext, useState} from 'react';
import {PopOverKey} from './types';
import {PopOver} from '@atb/components/popover';
import {useOneTimePopover} from './use-one-time-popover';
import OneTimePopOverTexts from '@atb/translations/components/OneTimePopOver';
import {useTranslation} from '@atb/translations';

export const POPOVER_ANIMATION_DURATION = 200;

type PopOverType = {
  target: React.RefObject<JSX.Element | null>;
  oneTimeKey: PopOverKey;
};

export type PopOverContextType = {
  addPopOver: (popOver: PopOverType) => void;
};

const PopOverContext = createContext<PopOverContextType>({
  addPopOver: () => {},
});

export const PopOverContextProvider: React.FC = ({children}) => {
  // Queue of popovers to display
  const [popOvers, setPopOvers] = useState<PopOverType[]>([]);
  const {isSeen, setPopOverSeen} = useOneTimePopover();
  const {t} = useTranslation();
  const current = popOvers[0];

  const addToolTip = useCallback(
    (toolTip: PopOverType) => {
      if (!isSeen(toolTip.oneTimeKey)) {
        // Setting a timeout before adding the popover to allow potential page transitions
        // or similar animations to complete before the tool tip is displayed.
        setTimeout(() => {
          setPopOvers((val) => [...val, toolTip]);
        }, 500);
      }
    },
    [isSeen],
  );

  const onToolTipClose = useCallback(
    async (oneTimeKey: PopOverKey) => {
      await setPopOverSeen(oneTimeKey);
      // Remove the first popover from the queue after the close animation has finished.
      setTimeout(
        () =>
          setPopOvers((val) => {
            const [_, ...rest] = val;
            return rest;
          }),
        POPOVER_ANIMATION_DURATION,
      );
    },
    [setPopOverSeen],
  );

  return (
    <PopOverContext.Provider value={{addPopOver: addToolTip}}>
      {current && (
        <PopOver
          key={current.oneTimeKey}
          from={current.target}
          isOpen={!isSeen(current.oneTimeKey)}
          heading={t(OneTimePopOverTexts[current.oneTimeKey].heading)}
          text={t(OneTimePopOverTexts[current.oneTimeKey].text)}
          animationDuration={POPOVER_ANIMATION_DURATION}
          onClose={() => onToolTipClose(current.oneTimeKey)}
        />
      )}
      {children}
    </PopOverContext.Provider>
  );
};

export function usePopOver() {
  const context = useContext(PopOverContext);
  if (context === undefined) {
    throw new Error(
      'PopOverContext must be used within a PopOverContextProvider',
    );
  }
  return context;
}
