import React from 'react';
import {Button} from '@atb/components/button';
import {Loading} from '@atb/components/loading';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useTranslation} from '@atb/translations';
import {useThemeContext} from '@atb/theme';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';

type AppSwitchActionButtonProps = {
  label: string;
  onPress: () => void;
  isLoading: boolean;
  hasError: boolean;
};

export const AppSwitchActionButton = ({
  label,
  onPress,
  isLoading,
  hasError,
}: AppSwitchActionButtonProps) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();

  if (isLoading) {
    return <Loading />;
  }

  if (hasError) {
    return (
      <MessageInfoBox
        type="error"
        message={t(MobilityTexts.errorLoadingValueCode.message)}
        onPressConfig={{
          action: onPress,
          text: t(MobilityTexts.errorLoadingValueCode.retry),
        }}
      />
    );
  }

  return (
    <Button
      expanded={true}
      text={label}
      onPress={onPress}
      mode="primary"
      interactiveColor={theme.color.interactive[0]}
      rightIcon={{svg: ExternalLink}}
      accessibilityRole="link"
    />
  );
};
