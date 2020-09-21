import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgTripPatternDepartureLabel(props: SvgProps) {
  return (
    <Svg width="36" height="20" viewBox="0 0 36 20" fill="none" {...props}>
      <Path
        d="M0 4C0 1.79086 1.79086 0 4 0H32C34.2091 0 36 1.79086 36 4V16C36 18.2091 34.2091 20 32 20H4C1.79086 20 0 18.2091 0 16V4Z"
        fill="#37424A"
      />
      <Path
        d="M4.7168 11.791C4.82812 13.25 6.06445 14.1992 7.85742 14.1992C9.79102 14.1992 11.0156 13.209 11.0156 11.6562C11.0156 10.4141 10.3125 9.73438 8.56055 9.29492L7.67578 9.06055C6.50977 8.76172 6.04688 8.38086 6.04688 7.71875C6.04688 6.86328 6.79102 6.30078 7.91602 6.30078C8.9707 6.30078 9.68555 6.81641 9.83203 7.68359H10.8926C10.8047 6.31836 9.58594 5.3457 7.95117 5.3457C6.16406 5.3457 4.96289 6.31836 4.96289 7.75391C4.96289 8.95508 5.625 9.64648 7.1543 10.0332L8.23828 10.3145C9.4043 10.6074 9.93164 11.0645 9.93164 11.7852C9.93164 12.623 9.09375 13.2383 7.95703 13.2383C6.75586 13.2383 5.91211 12.6758 5.7832 11.791H4.7168ZM13.0664 6.04883V7.68359H12.0469V8.52734H13.0664V12.3594C13.0664 13.5664 13.5879 14.0469 14.8887 14.0469C15.0879 14.0469 15.2812 14.0234 15.4805 13.9883V13.1387C15.293 13.1562 15.1934 13.1621 15.0117 13.1621C14.3555 13.1621 14.0742 12.8457 14.0742 12.1016V8.52734H15.4805V7.68359H14.0742V6.04883H13.0664ZM18.7617 14.1113C19.6055 14.1113 20.2969 13.7422 20.707 13.0684H20.8008V14H21.7617V9.67578C21.7617 8.36328 20.9004 7.57227 19.3594 7.57227C18.0117 7.57227 17.0156 8.24023 16.8809 9.25391H17.9004C18.041 8.75586 18.5684 8.46875 19.3242 8.46875C20.2676 8.46875 20.7539 8.89648 20.7539 9.67578V10.25L18.9316 10.3613C17.4609 10.4492 16.6289 11.0996 16.6289 12.2305C16.6289 13.3848 17.5371 14.1113 18.7617 14.1113ZM18.9492 13.2266C18.2168 13.2266 17.6719 12.8516 17.6719 12.207C17.6719 11.5742 18.0938 11.2402 19.0547 11.1758L20.7539 11.0645V11.6445C20.7539 12.5469 19.9863 13.2266 18.9492 13.2266ZM23.625 14H24.6328V10.0859C24.6328 9.19531 25.3301 8.55078 26.291 8.55078C26.4902 8.55078 26.8535 8.58594 26.9355 8.60938V7.60156C26.8066 7.58398 26.5957 7.57227 26.4316 7.57227C25.5938 7.57227 24.8672 8.00586 24.6797 8.62109H24.5859V7.68359H23.625V14ZM28.9688 6.04883V7.68359H27.9492V8.52734H28.9688V12.3594C28.9688 13.5664 29.4902 14.0469 30.791 14.0469C30.9902 14.0469 31.1836 14.0234 31.3828 13.9883V13.1387C31.1953 13.1562 31.0957 13.1621 30.9141 13.1621C30.2578 13.1621 29.9766 12.8457 29.9766 12.1016V8.52734H31.3828V7.68359H29.9766V6.04883H28.9688Z"
        fill="white"
      />
    </Svg>
  );
}
export default SvgTripPatternDepartureLabel;
