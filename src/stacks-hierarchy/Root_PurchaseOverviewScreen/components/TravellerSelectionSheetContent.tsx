import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import React, {useEffect} from 'react';
import {StyleSheet} from '@atb/theme';
import {MultipleTravellersSelection} from './Travellers/MultipleTravellersSelection';
import {SingleTravellerSelection} from './Travellers/SingleTravellerSelection';
import {useUserCountState} from './Travellers/use-user-count-state';
import {useBaggageCountState} from './Travellers/use-baggage-count-state';
import {type PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {MessageSectionItem, Section} from '@atb/components/sections';
import {UniqueWithCount} from '@atb/utils/unique-with-count';
import {UserProfile, BaggageProduct} from '@atb/modules/configuration';

type TravellerSelectionSheetProps = {
  selection: PurchaseSelectionType;
  updateCurrentSelection: (
    userProfiles: UniqueWithCount<UserProfile>[],
    baggageProducts: UniqueWithCount<BaggageProduct>[],
  ) => void;
  showNothingSelectedWarning: boolean;
};
export const TravellerSelectionSheetContent = ({
  selection,
  updateCurrentSelection,
  showNothingSelectedWarning,
}: TravellerSelectionSheetProps) => {
  const {t} = useTranslation();
  const styles = useStyles();

  const selectionMode =
    selection.fareProductTypeConfig.configuration.travellerSelectionMode;

  const userCountState = useUserCountState(selection);
  const baggageCountState = useBaggageCountState(selection);

  useEffect(() => {
    updateCurrentSelection(userCountState.state, baggageCountState.state);
  }, [userCountState.state, baggageCountState.state, updateCurrentSelection]);

  return (
    <View style={styles.container}>
      {showNothingSelectedWarning && (
        <Section style={styles.messageContainer}>
          <MessageSectionItem
            message={t(PurchaseOverviewTexts.selectAtLeastOneTraveller)}
            messageType="error"
          />
        </Section>
      )}
      {selectionMode === 'multiple' ? (
        <MultipleTravellersSelection
          userCountState={userCountState}
          baggageCountState={baggageCountState}
        />
      ) : (
        <SingleTravellerSelection {...userCountState} />
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      marginHorizontal: theme.spacing.medium,
    },
    messageContainer: {
      marginBottom: theme.spacing.medium,
    },
  };
});
