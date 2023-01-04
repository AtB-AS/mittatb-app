import {ScrollView} from 'react-native';
import React, {forwardRef, useState} from 'react';
import {
  getTextForLanguage,
  LanguageAndTextType,
  ScreenHeaderTexts,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import * as Sections from '@atb/components/sections';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button} from '@atb/components/button';
import {Add, Confirm} from '@atb/assets/svg/mono-icons/actions';
import {TransportModes} from '@atb/api/types/generated/journey_planner_v3_types';
import {TravelSearchFilters} from '@atb/screens/Dashboard/use-travel-search-filters-state';
import {getTransportModeSvg} from '@atb/components/transportation-icon';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';

export type TransportModesRaw = {
  transportMode: string;
  transportSubModes?: string[];
};

export type TransportIconModeType = Omit<
  TransportModes,
  'transportSubModes'
> & {
  transportSubMode?: Required<TransportModes>['transportSubModes'][0];
};

export type TransportModeFilterOption = {
  id: string;
  icon: TransportIconModeType;
  text: LanguageAndTextType[];
  description?: LanguageAndTextType[];
  modes: TransportModes[];
};

export const TravelSearchFiltersBottomSheet = forwardRef<
  any,
  {
    close: () => void;
    filters: TravelSearchFilters;
    initialSelection: TravelSearchFilters;
    onSave: (t: TravelSearchFilters) => void;
  }
>(({close, filters, initialSelection, onSave}, focusRef) => {
  const {t, language} = useTranslation();

  const [selectedModes, setSelectedModes] = useState<
    TransportModeFilterOption[] | undefined
  >(initialSelection.transportModes);

  const save = () => {
    onSave({
      transportModes: selectedModes,
    });
    close();
  };

  return (
    <BottomSheetContainer maxHeightValue={0.9}>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'cancel',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.cancel.text),
          testID: 'cancelButton',
        }}
        title={t(TripSearchTexts.filters.heading)}
        color="background_1"
        setFocusOnLoad={false}
      />
      <ScrollView
        style={{marginHorizontal: 12, marginBottom: 12}}
        ref={focusRef}
      >
        <Sections.Section>
          <Sections.HeaderSectionItem
            text={t(TripSearchTexts.filters.modes.heading)}
          />
          <Sections.ActionSectionItem
            mode="toggle"
            text={t(TripSearchTexts.filters.modes.all)}
            checked={selectedModes?.length === filters.transportModes?.length}
            onPress={(checked) => {
              setSelectedModes(checked ? filters.transportModes : []);
            }}
          />
          {filters.transportModes?.map((option) => {
            const text = getTextForLanguage(option.text, language);
            const description = getTextForLanguage(
              option.description,
              language,
            );
            return text ? (
              <Sections.ActionSectionItem
                key={option.id}
                mode="toggle"
                text={text}
                leftIcon={
                  getTransportModeSvg(
                    option.icon?.transportMode,
                    option.icon?.transportSubMode,
                  ) || Add
                }
                subtext={description}
                checked={selectedModes?.some(({id}) => id === option.id)}
                onPress={(checked) => {
                  setSelectedModes(
                    checked
                      ? selectedModes?.concat(option)
                      : selectedModes?.filter((m) => m.id !== option.id),
                  );
                }}
              />
            ) : null;
          })}
        </Sections.Section>
      </ScrollView>
      <FullScreenFooter>
        <Button
          text={t(TripSearchTexts.filters.save)}
          onPress={save}
          rightIcon={{svg: Confirm}}
        />
      </FullScreenFooter>
    </BottomSheetContainer>
  );
});
