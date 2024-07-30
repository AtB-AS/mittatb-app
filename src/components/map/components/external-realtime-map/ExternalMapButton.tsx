import React from 'react';
import {Button} from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import {Map} from '@atb/assets/svg/mono-icons/map';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {useFirestoreConfiguration} from '@atb/configuration';
import {MapSelectionActionType} from '../../types';

type ExternalMapButtonProps = {
  onMapClick: (sc: MapSelectionActionType) => void;
};
export const ExternalMapButton = ({onMapClick}: ExternalMapButtonProps) => {
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
      style={style.externalMapButton}
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
  externalMapButton: {
    marginBottom: theme.spacings.small,
  },
}));
