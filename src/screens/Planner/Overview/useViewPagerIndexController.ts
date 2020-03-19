import {MutableRefObject, useRef, useMemo, useState} from 'react';
import ViewPager from '@react-native-community/viewpager';
import useDebounce from '../../../utils/useDebounce';

type ViewPagerIndexController = {
  viewPagerRef: MutableRefObject<ViewPager | null>;
  nextPage: () => void;
  previousPage: () => void;
  onPageSelected: (index: number) => void;
  disablePaging: (disable: boolean) => void;
  isFirstPage: boolean;
  isLastPage: boolean;
};

type PageTypes = {
  isFirstPage: boolean;
  isLastPage: boolean;
};

export default function useViewPagerIndexController(
  initialPage: number,
  pageLength: number,
): ViewPagerIndexController {
  const viewPagerRef = useRef<ViewPager | null>(null);
  const disablePagingRef = useRef(false);
  const indexRef = useRef(initialPage);
  const [pageTypes, setPageTypes] = useState<PageTypes>({
    isLastPage: pageLength === 0 || initialPage === pageLength - 1,
    isFirstPage: initialPage === 0,
  });
  const debouncedPageTypes = useDebounce(pageTypes, 50);

  const controller = useMemo<
    Omit<ViewPagerIndexController, 'isFirstPage' | 'isLastPage'>
  >(() => {
    const disablePaging = (disable: boolean) => {
      disablePagingRef.current = disable;
    };

    const onPageSelected = (unsafeIndex: number) => {
      indexRef.current = unsafeIndex;
      setPageTypes({
        isFirstPage: unsafeIndex === 0,
        isLastPage: pageLength === 0 || unsafeIndex === pageLength - 1,
      });
    };

    const safeSetIndex = (unsafeIndex: number) => {
      if (
        !disablePagingRef.current &&
        unsafeIndex > -1 &&
        unsafeIndex < pageLength
      ) {
        onPageSelected(unsafeIndex);
        viewPagerRef.current && viewPagerRef.current.setPage(unsafeIndex);
      }
    };

    const nextPage = () => safeSetIndex(indexRef.current + 1);
    const previousPage = () => safeSetIndex(indexRef.current - 1);
    return {
      viewPagerRef,
      nextPage,
      previousPage,
      onPageSelected,
      disablePaging,
    };
  }, [pageLength]);

  return {...controller, ...debouncedPageTypes};
}
