import {FullScreenHeader} from '@atb/components/screen-header';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {OnBehalfOfTexts, useTranslation} from '@atb/translations';
import {useCallback, useRef} from 'react';
import {KeyboardAvoidingView, RefreshControl, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
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
import {FETCH_ON_BEHALF_OF_ACCOUNTS_QUERY_KEY} from '@atb/on-behalf-of/queries/use-fetch-on-behalf-of-accounts-query';
import {giveFocus} from '@atb/utils/use-focus-on-load';

type Props = RootStackScreenProps<'Root_ChooseTicketRecipientScreen'>;
const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

export const Root_ChooseTicketRecipientScreen = ({
  navigation,
  route: {params},
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);

  const [state, dispatch] = useRecipientSelectionState();

  const queryClient = useQueryClient();

  const onDeleteRef = useRef(undefined);

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'back'}}
        title={t(OnBehalfOfTexts.chooseReceiver.header)}
        setFocusOnLoad={true}
      />
      <KeyboardAvoidingView behavior="padding" style={styles.mainView}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.contentContainerStyle}
          refreshControl={
            <RefreshControl
              onRefresh={() =>
                queryClient.resetQueries([
                  FETCH_ON_BEHALF_OF_ACCOUNTS_QUERY_KEY,
                ])
              }
              refreshing={false}
              tintColor={themeColor.foreground.primary}
              colors={[themeColor.foreground.primary]}
            />
          }
        >
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
            themeColor={themeColor}
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
            themeColor={themeColor}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: getThemeColor(theme).background,
    flex: 1,
  },
  mainView: {flex: 1},
  contentContainerStyle: {padding: theme.spacing.medium},
}));
