import * as React from 'react';
import Svg, {
  Ellipse,
  Defs,
  RadialGradient,
  Stop,
  SvgProps,
} from 'react-native-svg';

function SvgSelectionPinShadow(props: SvgProps) {
  return (
    <Svg width={12} height={4} fill="none" viewBox="0 0 12 4" {...props}>
      <Ellipse
        cx={6}
        cy={2}
        fill="url(#SelectionPinShadow_svg__SelectionPinShadow_svg__paint0_radial)"
        rx={6}
        ry={2}
      />
      <Defs>
        <RadialGradient
          id="SelectionPinShadow_svg__SelectionPinShadow_svg__paint0_radial"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(0 2 -6 0 6 2)"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopOpacity={0.5} />
          <Stop offset={1} stopOpacity={0} />
        </RadialGradient>
      </Defs>
    </Svg>
  );
}

export default SvgSelectionPinShadow;
