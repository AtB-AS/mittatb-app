import {GenericSectionItem} from '@atb/components/sections';
import React, {useState} from 'react';
import {useParamAsState} from '@atb/utils/use-param-as-state';
import type {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {FullScreenView} from '@atb/components/screen-view';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Button} from '@atb/components/button';
import {TripSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/TripSelection';
import {
  DateSelection,
  DepartureSearchTime,
} from '@atb/components/date-selection';
import {ScreenHeading} from '@atb/components/heading';
import TripSelectionTexts from '@atb/translations/screens/TripSelectionScreen';
import {useTranslation} from '@atb/translations';
import {View} from 'react-native';

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
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();

  const screenHeaderTitle =
    selection.stopPlaces?.from && selection.stopPlaces?.to
      ? `${selection.stopPlaces.from.name} - ${selection.stopPlaces.to.name}`
      : undefined;

  return (
    <FullScreenView
      headerProps={{
        title: t(TripSelectionTexts.header),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={
        screenHeaderTitle
          ? (focusRef) => (
              <ScreenHeading ref={focusRef} text={screenHeaderTitle} />
            )
          : undefined
      }
    >
      <View style={styles.dateSelection}>
        <DateSelection
          searchTime={searchTime}
          setSearchTime={setSearchTime}
          backgroundColor={theme.color.background.neutral[1]}
        />
      </View>
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  dateSelection: {
    marginVertical: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
  },
}));
