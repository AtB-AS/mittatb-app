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
import {BaggageProduct, UserProfile} from '@atb/modules/configuration';
import {useMessage} from './message';

type TravellerSelectionSheetProps = {
  selection: PurchaseSelectionType;
  updateCurrentSelection: (
    userProfiles: UniqueWithCount<UserProfile>[],
    baggageProducts: UniqueWithCount<BaggageProduct>[],
  ) => void;
};
export const TravellerSelectionSheetContent = ({
  selection,
  updateCurrentSelection,
}: TravellerSelectionSheetProps) => {
  const styles = useStyles();

  const selectionMode =
    selection.fareProductTypeConfig.configuration.travellerSelectionMode;

  const userCountState = useUserCountState(selection);
  const baggageCountState = useBaggageCountState(selection);
  const {message, setMessageId} = useMessage(userCountState, baggageCountState);

  useEffect(() => {
    updateCurrentSelection(userCountState.state, baggageCountState.state);
  }, [userCountState.state, baggageCountState.state, updateCurrentSelection]);

  return (
    <View style={styles.container}>
      {!!message && (
        <Section style={styles.messageContainer}>
          <MessageSectionItem
            title={message.title}
            message={message.text}
            messageType={message.messageType}
          />
        </Section>
      )}
      {selectionMode === 'multiple' ? (
        <MultipleTravellersSelection
          userCountState={userCountState}
          baggageCountState={baggageCountState}
          setInfoMessage={setMessageId}
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
