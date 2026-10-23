import {ChevronLeft} from '@atb/assets/svg/mono-icons/navigation';
import {insets} from '@atb/utils/insets';
import React from 'react';
import {AccessibilityProps} from 'react-native';
import {Button} from '@atb/components/button';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';

export const BackArrow: React.FC<{onBack(): void} & AccessibilityProps> = ({
  onBack,
}) => {
  const {t} = useTranslation();

  return (
    <Button
      expanded={false}
      surfaceColor="neutral"
      onPress={onBack}
      text={t(ScreenHeaderTexts.headerButton.back.text)}
      type="small"
      mode="primary"
      hitSlop={insets.symmetric(12, 20)}
      leftIcon={{svg: ChevronLeft}}
      hasShadow={true}
    />
  );
};
