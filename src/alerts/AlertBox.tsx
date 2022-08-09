import React from 'react';
import {useTranslation} from '@atb/translations';
import {Alert, AlertContext, useAlertsState} from '@atb/alerts/AlertsContext';
import MessageBox from '@atb/components/message-box';
import {getReferenceDataText} from '@atb/reference-data/utils';
import {StyleProp, ViewStyle} from 'react-native';
import {Theme, useTheme} from '@atb/theme';

type AlertWithMarkdown = {
  lang: string;
  value: string;
  valueWithMarkdown?: string;
};

type Props = {
  alertContext?: AlertContext;
  style?: StyleProp<ViewStyle>;
};

const AlertBox = ({alertContext, style}: Props) => {
  const {language} = useTranslation();
  const {theme} = useTheme();
  const {findAlert} = useAlertsState();

  const alert = alertContext ? findAlert(alertContext) : undefined;

  if (!alert || !Object.keys(theme.static.status).includes(alert.type)) {
    return null;
  }

  return (
    <MessageBox
      containerStyle={style}
      title={getReferenceDataText(alert.title ?? [], language)}
      message={getReferenceDataText(
        markdownPreferredText(alert.body),
        language,
      )}
      type={alert.type}
      isMarkdown={true}
    />
  );
};

const markdownPreferredText = (alertsWithMarkdown: AlertWithMarkdown[]) =>
  alertsWithMarkdown.map((item) => {
    return {lang: item.lang, value: item.valueWithMarkdown || item.value};
  });

const isValidAlert = (theme: Theme, alert?: Alert) => {
  if (!alert) return false;
  return Object.keys(theme.static.status).includes(alert.type);
};

export default AlertBox;
