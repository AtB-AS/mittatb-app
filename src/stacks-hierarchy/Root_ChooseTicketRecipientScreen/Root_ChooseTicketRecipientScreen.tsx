import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {OnBehalfOfTexts, useTranslation} from '@atb/translations';
import {useCallback, useRef} from 'react';
import {KeyboardAvoidingView, View} from 'react-native';
import {animateNextChange} from '@atb/utils/animation';
import {useRecipientSelectionState} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/use-recipient-selection-state';
import {SubmitButton} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/components/SubmitButton';
import {SaveRecipientToggle} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/components/SaveRecipientToggle';
import {ExistingRecipientsList} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/components/ExistingRecipientsList';
import {PhoneAndNameInputSection} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/components/PhoneAndNameInputSection';
import {TitleAndDescription} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/components/TitleAndDescription';
import {useQueryClient} from '@tanstack/react-query';
import {Theme} from '@atb/theme/colors';
import {SendToOtherButton} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/components/SendToOtherButton';
import {FETCH_ON_BEHALF_OF_ACCOUNTS_QUERY_KEY} from '@atb/modules/on-behalf-of';
import {giveFocus, useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useManualRefreshControlProps} from '@atb/utils/use-manual-refresh-props';
import {FullScreenView} from '@atb/components/screen-view';

type Props = RootStackScreenProps<'Root_ChooseTicketRecipientScreen'>;
const getThemeColor = (theme: Theme) => theme.color.background.neutral[1];

export const Root_ChooseTicketRecipientScreen = ({
  navigation,
  route: {params},
}: Props) => {
  const focusRef = useFocusOnLoad(navigation);
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);

  const [state, dispatch] = useRecipientSelectionState();

  const queryClient = useQueryClient();

  const onDeleteRef = useRef(undefined);

  const refreshControlProps = useManualRefreshControlProps({
    onRefresh: () =>
      queryClient.resetQueries({
        queryKey: [FETCH_ON_BEHALF_OF_ACCOUNTS_QUERY_KEY],
      }),
    refreshing: false,
  });

  return (
    <FullScreenView
      headerProps={{
        leftButton: {type: 'back'},
        title: t(OnBehalfOfTexts.chooseReceiver.header),
      }}
      refreshControlProps={refreshControlProps}
      focusRef={focusRef}
    >
      <KeyboardAvoidingView behavior="position">
        <View style={styles.container}>
          <TitleAndDescription themeColor={themeColor} ref={onDeleteRef} />

          <ExistingRecipientsList
            state={state}
            onSelect={(recipient) => {
              animateNextChange();
              dispatch({type: 'SELECT_RECIPIENT', recipient});
            }}
            onEmptyRecipients={useCallback(() => {
              animateNextChange();
              dispatch({type: 'SELECT_SEND_TO_OTHER'});
            }, [dispatch])}
            onDelete={useCallback(() => giveFocus(onDeleteRef), [])}
          />
          <SendToOtherButton
            state={state}
            onPress={() => {
              animateNextChange();
              dispatch({type: 'SELECT_SEND_TO_OTHER'});
            }}
            themeColor={themeColor}
          />

          <PhoneAndNameInputSection
            state={state}
            onChangePrefix={(v) => dispatch({type: 'SET_PREFIX', prefix: v})}
            onChangePhone={(v) => dispatch({type: 'SET_PHONE', phoneNumber: v})}
            onChangeName={(v) => dispatch({type: 'SET_NAME', name: v})}
            themeColor={themeColor}
          />
          <SaveRecipientToggle
            state={state}
            onPress={() => {
              animateNextChange();
              dispatch({type: 'TOGGLE_SAVE_RECIPIENT'});
            }}
            themeColor={themeColor}
          />

          <SubmitButton
            state={state}
            onSubmit={(recipient) =>
              navigation.navigate('Root_PurchaseConfirmationScreen', {
                ...params,
                recipient,
              })
            }
            onError={(e) => {
              animateNextChange();
              dispatch({type: 'SET_ERROR', error: e});
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: theme.spacing.medium,
  },
}));
