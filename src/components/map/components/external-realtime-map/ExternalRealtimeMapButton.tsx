import React from 'react';
import {Button} from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import {Map} from '@atb/assets/svg/mono-icons/map';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {useFirestoreConfiguration} from '@atb/configuration';
import {MapSelectionActionType} from '../../types';

type ExternalRealtimeMapButtonProps = {
  onMapClick: (sc: MapSelectionActionType) => void;
};
export const ExternalRealtimeMapButton = ({
  onMapClick,
}: ExternalRealtimeMapButtonProps) => {
  const style = useStyle();
  const {language} = useTranslation();
  const {configurableLinks} = useFirestoreConfiguration();

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
      interactiveColor="interactive_2"
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
    marginBottom: theme.spacings.small,
  },
}));
