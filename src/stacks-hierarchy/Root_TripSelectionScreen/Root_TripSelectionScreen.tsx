import {GenericSectionItem} from '@atb/components/sections';
import React, {useState} from 'react';
import {useParamAsState} from '@atb/utils/use-param-as-state';
import type {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {FullScreenView} from '@atb/components/screen-view';
import {useThemeContext} from '@atb/theme';
import {Button} from '@atb/components/button';
import {TripSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/TripSelection';
import {
  DateSelection,
  DepartureSearchTime,
} from '@atb/components/date-selection';

type Props = RootStackScreenProps<'Root_TripSelectionScreen'>;

export const Root_TripSelectionScreen: React.FC<Props> = ({
  navigation,
  route: {params},
}) => {
  const [selection, setSelection] = useParamAsState(params.selection);
  const [searchTime, setSearchTime] = useState<DepartureSearchTime>({
    date: new Date().toISOString(),
    option: 'now',
  });
  const {theme} = useThemeContext();

  return (
    <FullScreenView
      headerProps={{
        title: 'Velg avgang',
        leftButton: {
          type: 'back',
          onPress: () => navigation.pop(),
        },
      }}
    >
      <DateSelection
        searchTime={searchTime}
        setSearchTime={setSearchTime}
        backgroundColor={theme.color.background.neutral[1]}
      />
      <GenericSectionItem
        style={{
          borderRadius: theme.border.radius.regular,
          margin: theme.spacing.small,
        }}
      >
        <TripSelection selection={selection} setSelection={setSelection} />
      </GenericSectionItem>
      <Button
        onPress={() => {
          navigation.navigate({
            name: 'Root_PurchaseConfirmationScreen',
            params: {
              mode: 'Ticket',
              selection: selection,
            },
            merge: true,
          });
        }}
        expanded={false}
        text="Bekreft"
      />
    </FullScreenView>
  );
};
