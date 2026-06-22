import React from 'react';
import {View, ViewStyle} from 'react-native';
import {SvgProps} from 'react-native-svg';
// eslint-disable-next-line no-restricted-syntax -- resolve a themed asset dynamically by its server-driven name
import * as ThemedAssets from '@atb/theme/ThemedAssets';

type ThemedAsset = (props: SvgProps) => React.JSX.Element;

const themedAssets = ThemedAssets as unknown as Record<
  string,
  ThemedAsset | undefined
>;

/**
 * Resolves the server-driven `illustration` string to a themed asset by name,
 * e.g. "BonusStar" -> ThemedBonusStar. Any existing themed asset can be used
 * without maintaining a registry; unknown values render nothing.
 */
const resolveIllustration = (
  illustration: string | undefined,
): ThemedAsset | undefined => {
  if (!illustration) return undefined;
  const asset = themedAssets[`Themed${illustration}`];
  return typeof asset === 'function' ? asset : undefined;
};

type BenefitIllustrationProps = {
  illustration: string | undefined;
  style?: ViewStyle;
};

export const BenefitIllustration = ({
  illustration,
  style,
}: BenefitIllustrationProps): React.JSX.Element | null => {
  const Asset = resolveIllustration(illustration);
  if (!Asset) return null;
  return (
    <View style={style}>
      <Asset height={54} width={54} />
    </View>
  );
};
