import {Dispatch, useReducer} from 'react';
import {
  ExistingRecipientType,
  OnBehalfOfErrorCode,
  RecipientSelectionState,
} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/types.ts';

type RecipientSelectionAction =
  | {type: 'SET_RECIPIENTS'; recipients: ExistingRecipientType[]}
  | {type: 'SELECT_RECIPIENT'; recipient: ExistingRecipientType}
  | {type: 'SELECT_SEND_TO_OTHER'}
  | {type: 'SET_PREFIX'; prefix: string}
  | {type: 'SET_PHONE'; phoneNumber: string}
  | {type: 'TOGGLE_SAVE_RECIPIENT'}
  | {type: 'SET_NAME'; name: string}
  | {type: 'SET_ERROR'; error?: OnBehalfOfErrorCode};

type ReducerType = (
  prevState: RecipientSelectionState,
  action: RecipientSelectionAction,
) => RecipientSelectionState;

export const useRecipientSelectionState = (): [
  RecipientSelectionState,
  Dispatch<RecipientSelectionAction>,
] => {
  const [state, dispatch] = useReducer(reducer, {
    settingPhone: false,
    settingName: false,
    prefix: '47',
  });

  return [state, dispatch];
};

const reducer: ReducerType = (prevState, action): RecipientSelectionState => {
  switch (action.type) {
    case 'SET_RECIPIENTS':
      return {
        ...prevState,
        settingPhone: prevState.settingPhone || !action.recipients?.length,
        recipients: action.recipients,
      };
    case 'SELECT_RECIPIENT':
      return {
        ...prevState,
        recipients: prevState.recipients,
        settingPhone: false,
        settingName: false,
        recipient: action.recipient,
        error: undefined,
      };
    case 'SELECT_SEND_TO_OTHER':
      return {
        ...prevState,
        settingPhone: true,
        recipient: undefined,
      };
    case 'SET_PREFIX':
      return {...prevState, prefix: action.prefix, error: undefined};
    case 'SET_PHONE':
      return {...prevState, phone: action.phoneNumber, error: undefined};
    case 'TOGGLE_SAVE_RECIPIENT':
      return {...prevState, settingName: !prevState.settingName};
    case 'SET_NAME':
      return {...prevState, name: action.name, error: undefined};
    case 'SET_ERROR':
      return {...prevState, error: action.error};
  }
};
