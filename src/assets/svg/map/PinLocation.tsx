import * as React from 'react';
import Svg, {Mask, Path, SvgProps} from 'react-native-svg';

function SvgPinLocation(props: SvgProps) {
  return (
    <Svg width={20} height={27} fill="none" viewBox="0 0 20 27" {...props}>
      <Mask
        id="PinLocation_svg__a"
        width={14}
        height={19}
        x={3}
        y={1}
        fill="#000"
        maskUnits="userSpaceOnUse"
      >
        <Path fill="#fff" d="M3 1h14v19H3z" />
        <Path
          fillRule="evenodd"
          d="M16 8c0 5.314-6 10-6 10S4 13.314 4 8a6 6 0 1112 0zm-6 1.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
          clipRule="evenodd"
        />
      </Mask>
      <Path
        fill="#71D6E0"
        fillRule="evenodd"
        d="M16 8c0 5.314-6 10-6 10S4 13.314 4 8a6 6 0 1112 0zm-6 1.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        clipRule="evenodd"
      />
      <Path
        fill="#fff"
        d="M10 18l-.616.788.616.48.616-.48L10 18zm0 0l.616.788.002-.002.005-.004a2.275 2.275 0 00.074-.06 20.406 20.406 0 00.92-.805 22.98 22.98 0 002.157-2.292C15.318 13.736 17 11.01 17 8h-2c0 2.305-1.318 4.578-2.774 6.36a21.233 21.233 0 01-2.613 2.664 11.274 11.274 0 01-.218.18l-.01.007-.001.001L10 18zM3 8c0 3.01 1.682 5.736 3.226 7.625a23.244 23.244 0 002.871 2.927 13.352 13.352 0 00.263.217l.017.013a.463.463 0 00.005.004l.001.001h.001L10 18l.616-.788h-.001a1 1 0 00-.053-.043 18.47 18.47 0 01-.82-.717 21.24 21.24 0 01-1.968-2.092C6.318 12.578 5 10.305 5 8H3zm7-7a7 7 0 00-7 7h2a5 5 0 015-5V1zm7 7a7 7 0 00-7-7v2a5 5 0 015 5h2zm-6.5 0a.5.5 0 01-.5.5v2A2.5 2.5 0 0012.5 8h-2zm-.5-.5a.5.5 0 01.5.5h2A2.5 2.5 0 0010 5.5v2zm-.5.5a.5.5 0 01.5-.5v-2A2.5 2.5 0 007.5 8h2zm.5.5a.5.5 0 01-.5-.5h-2a2.5 2.5 0 002.5 2.5v-2z"
        mask="url(#PinLocation_svg__a)"
      />
      <Path
        stroke="#fff"
        strokeLinecap="square"
        strokeWidth={3}
        d="M8 20l4 4m0-4l-4 4"
      />
      <Path stroke="#000" strokeLinecap="square" d="M8 20l4 4m0-4l-4 4" />
    </Svg>
  );
}

export default SvgPinLocation;
