import React from 'react';
import {useTranslation} from '@atb/translations';
import {AlertContext, useAlertsState} from '@atb/alerts/AlertsContext';
import MessageBox from '@atb/components/message-box';
import {getReferenceDataText} from '@atb/reference-data/utils';
import {StyleProp, ViewStyle} from 'react-native';

type Props = {
  alertContext?: AlertContext;
  style?: StyleProp<ViewStyle>;
};

const AlertBox = ({alertContext, style}: Props) => {
  const {language} = useTranslation();
  const {findAlert} = useAlertsState();

  const alert = alertContext ? findAlert(alertContext) : undefined;
  return alert ? (
    <MessageBox
      containerStyle={style}
      title={getReferenceDataText(alert?.title ?? [], language)}
      message={getReferenceDataText(alert.body, language)}
      type={alert.type}
    />
  ) : null;
};

export default AlertBox;
