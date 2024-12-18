import React from 'react';
import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Map} from '@atb/assets/svg/mono-icons/map';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {useFirestoreConfigurationContext} from '@atb/configuration';
import {MapSelectionActionType} from '../../types';

type ExternalRealtimeMapButtonProps = {
  onMapClick: (sc: MapSelectionActionType) => void;
};
export const ExternalRealtimeMapButton = ({
  onMapClick,
}: ExternalRealtimeMapButtonProps) => {
  const style = useStyle();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[2];

  const {language} = useTranslation();
  const {configurableLinks} = useFirestoreConfigurationContext();

  const externalRealtimeMapUrl = getTextForLanguage(
    configurableLinks?.externalRealtimeMap,
    language,
  );

  if (!externalRealtimeMapUrl) {
    return null;
  }

  return (
    <Button
      style={style.button}
      type="medium"
      compact={true}
      interactiveColor={interactiveColor}
      accessibilityRole="button"
      onPress={() =>
        onMapClick({
          source: 'external-map-button',
          url: externalRealtimeMapUrl,
        })
      }
      rightIcon={{svg: Map}}
      hasShadow={true}
    />
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  button: {
    marginBottom: theme.spacing.small,
  },
}));
