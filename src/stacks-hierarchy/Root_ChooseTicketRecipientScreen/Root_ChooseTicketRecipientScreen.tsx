import {FullScreenHeader} from '@atb/components/screen-header';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {StyleSheet, useTheme} from '@atb/theme';
import {getStaticColor, StaticColorByType} from '@atb/theme/colors';
import {OnBehalfOfTexts, useTranslation} from '@atb/translations';
import {useCallback} from 'react';
import {KeyboardAvoidingView, RefreshControl, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {animateNextChange} from '@atb/utils/animation.ts';
import {useRecipientSelectionState} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/use-recipient-selection-state.ts';
import {SubmitButton} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/components/SubmitButton.tsx';
import {SaveRecipientToggle} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/components/SaveRecipientToggle.tsx';
import {ExistingRecipientsList} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/components/ExistingRecipientsList.tsx';
import {PhoneAndNameInputSection} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/components/PhoneAndNameInputSection.tsx';
import {SendToOtherButton} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/components/SendToOtherButton.tsx';
import {TitleAndDescription} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/components/TitleAndDescription.tsx';
import {
    FETCH_RECIPIENTS_QUERY_KEY,
    useFetchRecipientsQuery
} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/use-fetch-recipients-query.ts';
import {useQueryClient} from '@tanstack/react-query';

type Props = RootStackScreenProps<'Root_ChooseTicketRecipientScreen'>;
const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const Root_ChooseTicketRecipientScreen = ({
  navigation,
  route: {params},
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {themeName} = useTheme();

  const [state, dispatch] = useRecipientSelectionState();
  const recipientsQuery = useFetchRecipientsQuery();

  const queryClient = useQueryClient();

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'back'}}
        title={t(OnBehalfOfTexts.chooseReceiver.header)}
        setFocusOnLoad={false}
      />
      <KeyboardAvoidingView behavior="padding" style={styles.mainView}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.contentContainerStyle}
          refreshControl={
            <RefreshControl
              onRefresh={() =>
                queryClient.resetQueries([FETCH_RECIPIENTS_QUERY_KEY])
              }
              refreshing={false}
              tintColor={getStaticColor(themeName, themeColor).text}
              colors={[getStaticColor(themeName, themeColor).text]}
            />
          }
        >
          <TitleAndDescription themeColor={themeColor} />

          <ExistingRecipientsList
            state={state}
            recipientsQuery={recipientsQuery}
            onSelect={(recipient) => {
              animateNextChange();
              dispatch({type: 'SELECT_RECIPIENT', recipient});
            }}
            onErrorOrEmpty={useCallback(() => {
              animateNextChange();
              dispatch({type: 'SELECT_SEND_TO_OTHER'});
            }, [dispatch])}
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
            recipientsQuery={recipientsQuery}
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
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
  },
  mainView: {flex: 1},
  contentContainerStyle: {padding: theme.spacings.medium},
}));
