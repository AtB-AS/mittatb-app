import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgTripPatternDestinationLabel(props: SvgProps) {
  return (
    <Svg width="35" height="20" viewBox="0 0 35 20" fill="none" {...props}>
      <Path
        d="M0 4C0 1.79086 1.79086 0 4 0H31C33.2091 0 35 1.79086 35 4V16C35 18.2091 33.2091 20 31 20H4C1.79086 20 0 18.2091 0 16V4Z"
        fill="#37424A"
      />
      <Path
        d="M4.97266 11.791C5.08398 13.25 6.32031 14.1992 8.11328 14.1992C10.0469 14.1992 11.2715 13.209 11.2715 11.6562C11.2715 10.4141 10.5684 9.73438 8.81641 9.29492L7.93164 9.06055C6.76562 8.76172 6.30273 8.38086 6.30273 7.71875C6.30273 6.86328 7.04688 6.30078 8.17188 6.30078C9.22656 6.30078 9.94141 6.81641 10.0879 7.68359H11.1484C11.0605 6.31836 9.8418 5.3457 8.20703 5.3457C6.41992 5.3457 5.21875 6.31836 5.21875 7.75391C5.21875 8.95508 5.88086 9.64648 7.41016 10.0332L8.49414 10.3145C9.66016 10.6074 10.1875 11.0645 10.1875 11.7852C10.1875 12.623 9.34961 13.2383 8.21289 13.2383C7.01172 13.2383 6.16797 12.6758 6.03906 11.791H4.97266ZM12.959 14H13.9668V5.17578H12.959V14ZM21.0332 7.68359H20.0254V11.4219C20.0254 12.5293 19.416 13.1914 18.3027 13.1914C17.2949 13.1914 16.873 12.6641 16.873 11.5273V7.68359H15.8652V11.7734C15.8652 13.2676 16.6035 14.1113 18.0215 14.1113C18.9883 14.1113 19.6621 13.7129 19.9785 13.0098H20.0723V14H21.0332V7.68359ZM23.3535 6.04883V7.68359H22.334V8.52734H23.3535V12.3594C23.3535 13.5664 23.875 14.0469 25.1758 14.0469C25.375 14.0469 25.5684 14.0234 25.7676 13.9883V13.1387C25.5801 13.1562 25.4805 13.1621 25.2988 13.1621C24.6426 13.1621 24.3613 12.8457 24.3613 12.1016V8.52734H25.7676V7.68359H24.3613V6.04883H23.3535ZM27.7129 6.04883V7.68359H26.6934V8.52734H27.7129V12.3594C27.7129 13.5664 28.2344 14.0469 29.5352 14.0469C29.7344 14.0469 29.9277 14.0234 30.127 13.9883V13.1387C29.9395 13.1562 29.8398 13.1621 29.6582 13.1621C29.002 13.1621 28.7207 12.8457 28.7207 12.1016V8.52734H30.127V7.68359H28.7207V6.04883H27.7129Z"
        fill="white"
      />
    </Svg>
  );
}
export default SvgTripPatternDestinationLabel;
