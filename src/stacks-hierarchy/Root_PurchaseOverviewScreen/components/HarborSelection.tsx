import {ThemeText} from '@atb/components/text';
import {FareProductTypeConfig} from '@atb/configuration';
import {StyleSheet} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import React, {forwardRef} from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {GenericClickableSectionItem, Section} from '@atb/components/sections';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {Root_PurchaseHarborSearchScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseHarborSearchScreen/navigation-types';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';

type StopPlaceSelectionProps = {
  fareProductTypeConfig: FareProductTypeConfig;
  fromHarbor?: StopPlaceFragment;
  toHarbor?: StopPlaceFragment;
  preassignedFareProduct: PreassignedFareProduct;
  onSelect: (params: Root_PurchaseHarborSearchScreenParams) => void;
  style?: StyleProp<ViewStyle>;
};

export const HarborSelection = forwardRef<
  TouchableOpacity,
  StopPlaceSelectionProps
>(
  (
    {
      fareProductTypeConfig,
      fromHarbor,
      toHarbor,
      preassignedFareProduct,
      onSelect,
      style,
    }: StopPlaceSelectionProps,
    harborInputSectionItemRef,
  ) => {
    const styles = useStyles();
    const {t} = useTranslation();

    return (
      <View style={style} accessible={false}>
        <ThemeText
          type="body__secondary"
          color="secondary"
          style={styles.sectionText}
          accessibilityLabel={t(
            PurchaseOverviewTexts.stopPlaces.harborSelection.select.a11yLabel,
          )}
        >
          {t(PurchaseOverviewTexts.stopPlaces.harborSelection.select.text)}
        </ThemeText>

        <Section accessible={false}>
          {(['from', 'to'] as ('from' | 'to')[]).map((fromOrTo) => {
            const harbor = fromOrTo === 'from' ? fromHarbor : toHarbor;
            const harborStyle =
              fromOrTo === 'from' ? styles.fromHarbor : styles.toHarbor;
            const disabled = fromOrTo === 'to' && !fromHarbor;
            return (
              <GenericClickableSectionItem
                key={fromOrTo}
                ref={harborInputSectionItemRef}
                accessibilityState={{disabled}}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={t(
                  PurchaseOverviewTexts.stopPlaces.harborSelection[
                    fromOrTo
                  ].a11yLabel(harbor?.name),
                )}
                accessibilityHint={
                  disabled
                    ? undefined
                    : t(
                        PurchaseOverviewTexts.stopPlaces.harborSelection[
                          fromOrTo
                        ].a11yHint,
                      )
                }
                onPress={() =>
                  onSelect({
                    ...(fromOrTo !== 'from' && fromHarbor ? {fromHarbor} : {}),
                    fareProductTypeConfig,
                    preassignedFareProduct,
                  })
                }
                testID="selectHarborsButton"
              >
                <>
                  <View style={harborStyle}>
                    <ThemeText
                      color={disabled ? 'disabled' : 'secondary'}
                      type="body__secondary"
                      style={styles.toFromLabel}
                    >
                      {t(PurchaseOverviewTexts.fromToLabel[fromOrTo])}
                    </ThemeText>
                    <HarborLabel harbor={harbor} disabled={disabled} />
                  </View>
                </>
              </GenericClickableSectionItem>
            );
          })}
        </Section>
      </View>
    );
  },
);

const HarborLabel = ({
  harbor,
  disabled = false,
}: {
  harbor?: StopPlaceFragment;
  disabled?: boolean;
}) => {
  const harborName = harbor?.name;
  const {t} = useTranslation();
  return harborName ? (
    <ThemeText type="body__primary--bold">{harborName}</ThemeText>
  ) : (
    <ThemeText
      style={{flexShrink: 1}}
      color={disabled ? 'disabled' : 'primary'}
    >
      {t(PurchaseOverviewTexts.stopPlaces.harborSelection.noneSelected.text)}
    </ThemeText>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  sectionText: {
    marginBottom: theme.spacings.medium,
  },
  fromHarbor: {
    flexDirection: 'row',
  },
  toHarbor: {
    flexDirection: 'row',
    marginTop: theme.spacings.small,
  },
  toFromLabel: {
    minWidth: 40,
    marginRight: theme.spacings.small,
  },
}));
