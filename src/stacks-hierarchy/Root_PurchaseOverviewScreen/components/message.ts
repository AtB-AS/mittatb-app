import {Statuses} from '@atb/theme';
import type {UniqueCountState} from '@atb/utils/unique-with-count';
import {BaggageProduct, UserProfile} from '@atb/modules/configuration';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {useState} from 'react';

export enum MessageId {
  loginRequired = 'loginRequired',
  limitReached = 'limitReached',
  nothingSelected = 'nothingSelected',
}

export type Message = {
  title?: string;
  text: string;
  messageType: Statuses;
};

export function useMessage(
  userCountState: UniqueCountState<UserProfile>,
  baggageCountState: UniqueCountState<BaggageProduct>,
): {message?: Message; setMessageId: (messageId?: MessageId) => void} {
  const {t} = useTranslation();
  const [externalMessageId, setMessageId] = useState<MessageId>();

  const nothingSelected =
    userCountState.state.every((u) => !u.count) &&
    baggageCountState.state.every((sp) => !sp.count);

  const messageId = nothingSelected
    ? MessageId.nothingSelected
    : externalMessageId;

  const message: Message | undefined = (() => {
    switch (messageId) {
      case MessageId.nothingSelected:
        return {
          messageType: 'error',
          text: t(PurchaseOverviewTexts.messages.selectAtLeastOneTraveller),
        };
      case MessageId.loginRequired:
        return {
          title: t(PurchaseOverviewTexts.messages.loginRequired),
          text: t(PurchaseOverviewTexts.messages.loginForFreeReservations),
          messageType: 'info',
        };
      case MessageId.limitReached:
        return {
          title: t(PurchaseOverviewTexts.messages.multiReservationTitle),
          text: t(PurchaseOverviewTexts.messages.multiReservation),
          messageType: 'info',
        };
    }
  })();

  return {message, setMessageId};
}
