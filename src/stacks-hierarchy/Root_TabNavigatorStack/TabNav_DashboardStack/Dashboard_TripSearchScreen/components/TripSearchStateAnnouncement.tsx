import React, {useEffect, useState} from 'react';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {TripSearchTexts, useTranslation} from '@atb/translations';
import type {SearchStateType} from '../../types';

/**
 * Announces the trip search state to screen readers.
 *
 * Kept in its own component so updating the message doesn't re-render the
 * whole trip search screen and its results.
 */
export const TripSearchStateAnnouncement: React.FC<{
  tripsSearchState: SearchStateType;
  screenHasFocus: boolean;
}> = ({tripsSearchState, screenHasFocus}) => {
  const {t} = useTranslation();
  const [searchStateMessage, setSearchStateMessage] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (!screenHasFocus) return;
    switch (tripsSearchState) {
      case 'searching':
        setSearchStateMessage(t(TripSearchTexts.searchState.searching));
        break;
      case 'search-success':
        setSearchStateMessage(t(TripSearchTexts.searchState.searchSuccess));
        break;
      case 'search-empty-result':
        setSearchStateMessage(t(TripSearchTexts.searchState.searchEmptyResult));
        break;
      default:
        setSearchStateMessage('');
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripsSearchState, t]);

  return <ScreenReaderAnnouncement message={searchStateMessage} />;
};
