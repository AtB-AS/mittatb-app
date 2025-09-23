import React from 'react';
import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Map} from '@atb/assets/svg/mono-icons/map';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useMapContext} from '../../MapContext';
import {MapStateActionType} from '../../mapStateReducer';

type ExternalRealtimeMapButtonProps = {};
export const ExternalRealtimeMapButton =
  ({}: ExternalRealtimeMapButtonProps) => {
    const style = useStyle();
    const {theme} = useThemeContext();
    const interactiveColor = theme.color.interactive[2];
    const {dispatchMapState} = useMapContext();

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
        expanded={false}
        style={style.button}
        type="small"
        interactiveColor={interactiveColor}
        accessibilityRole="button"
        onPress={() =>
          dispatchMapState({
            type: MapStateActionType.ExternalMap,
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
