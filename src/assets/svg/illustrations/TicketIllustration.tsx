import * as React from 'react';
import Svg, {SvgProps, G, Path, Defs} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function SvgTicketIllustration(props: SvgProps) {
  return (
    <Svg width={128} height={111} fill="none" viewBox="0 0 128 111" {...props}>
      <G filter="url(#TicketIllustration_svg__TicketIllustration_svg__filter0_d)">
        <Path
          fill="#75B8C4"
          fillRule="evenodd"
          d="M4.748 52.82a2 2 0 01.784-2.718L93.935 1.257a2 2 0 012.718.783l6.816 12.337c.518.937.19 2.104-.62 2.806-4.017 3.48-5.199 9.408-2.525 14.247s8.321 6.994 13.406 5.445c1.025-.312 2.187.031 2.705.969l6.817 12.337a2 2 0 01-.784 2.717l-88.403 48.845a2 2 0 01-2.718-.783l-7.501-13.576a.496.496 0 01.2-.67c5.56-3.072 7.576-10.069 4.505-15.628-3.072-5.559-10.068-7.575-15.627-4.504a.496.496 0 01-.675-.186l-7.5-13.577z"
          clipRule="evenodd"
        />
      </G>
      <G filter="url(#TicketIllustration_svg__TicketIllustration_svg__filter1_d)">
        <Path
          fill="#007C92"
          fillRule="evenodd"
          d="M11.781 45.29a2 2 0 012-2h101a2 2 0 012 2v14.094c0 1.071-.852 1.934-1.9 2.156-5.199 1.104-9.1 5.721-9.1 11.25 0 5.528 3.901 10.145 9.1 11.249 1.048.222 1.9 1.085 1.9 2.156v14.095a2 2 0 01-2 2h-101a2 2 0 01-2-2V84.779c0-.273.227-.49.5-.49 6.351 0 11.5-5.148 11.5-11.5 0-6.35-5.149-11.5-11.5-11.5a.496.496 0 01-.5-.489V45.29z"
          clipRule="evenodd"
        />
      </G>
      <Path
        stroke="#fff"
        d="M9.781 39.79h101a1.5 1.5 0 011.5 1.5v14.094c0 .787-.636 1.483-1.503 1.667-5.426 1.152-9.497 5.97-9.497 11.739 0 5.769 4.071 10.586 9.497 11.738.867.184 1.503.88 1.503 1.667V96.29a1.5 1.5 0 01-1.5 1.5h-101a1.5 1.5 0 01-1.5-1.5v-15.5c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12v-15.5a1.5 1.5 0 011.5-1.5z"
      />
      <Path
        fill="#fff"
        d="M57.4 78.58c3.223 0 5.49-1.912 5.49-4.577v-.021c0-2.17-1.483-3.545-3.685-3.75v-.053c1.826-.397 3.169-1.686 3.169-3.61v-.02c0-2.396-1.977-4.05-5.006-4.05-2.954 0-4.974 1.729-5.21 4.34l-.011.118h2.267l.01-.108c.14-1.46 1.3-2.374 2.944-2.374 1.697 0 2.664.881 2.664 2.385v.021c0 1.44-1.16 2.482-2.868 2.482h-1.751v1.869h1.815c1.987 0 3.212.978 3.212 2.728v.022c0 1.525-1.214 2.589-3.05 2.589-1.849 0-3.084-.989-3.234-2.396l-.011-.107h-2.31l.011.129c.204 2.567 2.31 4.383 5.554 4.383zm13.816.085c3.556 0 5.693-3.125 5.693-8.12v-.022c0-4.995-2.138-8.11-5.693-8.11-3.556 0-5.694 3.115-5.694 8.11v.021c0 4.996 2.138 8.121 5.694 8.121zm0-1.998c-2.073 0-3.266-2.33-3.266-6.123v-.021c0-3.792 1.193-6.102 3.266-6.102 2.062 0 3.276 2.31 3.276 6.102v.021c0 3.792-1.214 6.124-3.276 6.124z"
      />
      <Defs></Defs>
    </Svg>
  );
}

export default SvgTicketIllustration;
