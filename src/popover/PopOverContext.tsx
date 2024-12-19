import React, {
  Component,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import {PopOverKey} from './types';
import {PopOver} from '@atb/components/popover';
import {useOneTimePopover} from './use-one-time-popover';
import OneTimePopOverTexts from '@atb/translations/components/OneTimePopOver';
import {useTranslation} from '@atb/translations';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';

export const POPOVER_ANIMATION_DURATION = 200;

type PopOverType = {
  target: React.RefObject<Component | null>;
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
  const {isPopOverSeen, setPopOverSeen} = useOneTimePopover();
  const {t} = useTranslation();
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  const currentPopOver = popOvers[0];

  const addPopOver = useCallback(
    (popOver: PopOverType) => {
      if (!isPopOverSeen(popOver.oneTimeKey)) {
        // Run after interactions to allow potential page transitions
        // or similar animations to complete before the popover is displayed.
        // PopOver temporarily disabled
        // see https://github.com/AtB-AS/kundevendt/issues/17628
        // InteractionManager.runAfterInteractions(() =>
        //   setPopOvers((val) => [...val, popOver]),
        // );
      }
    },
    [isPopOverSeen],
  );

  const onClose = useCallback(
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
    <PopOverContext.Provider value={{addPopOver}}>
      {!isScreenReaderEnabled && currentPopOver && (
        <PopOver
          key={currentPopOver.oneTimeKey}
          from={currentPopOver.target}
          isOpen={!isPopOverSeen(currentPopOver.oneTimeKey)}
          heading={t(OneTimePopOverTexts[currentPopOver.oneTimeKey].heading)}
          text={t(OneTimePopOverTexts[currentPopOver.oneTimeKey].text)}
          animationDuration={POPOVER_ANIMATION_DURATION}
          onClose={() => onClose(currentPopOver.oneTimeKey)}
        />
      )}
      {children}
    </PopOverContext.Provider>
  );
};

export function usePopOverContext() {
  const context = useContext(PopOverContext);
  if (context === undefined) {
    throw new Error(
      'PopOverContext must be used within a PopOverContextProvider',
    );
  }
  return context;
}
