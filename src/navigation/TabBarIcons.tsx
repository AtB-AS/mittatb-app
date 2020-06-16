import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export function PlannerIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="#878E92" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 8C12 10.2091 10.2091 12 8 12C5.79086 12 4 10.2091 4 8C4 5.79086 5.79086 4 8 4C10.2091 4 12 5.79086 12 8ZM11.4765 12.8907C10.4957 13.5892 9.29583 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 9.29583 13.5892 10.4957 12.8907 11.4765L17.7071 16.2929C18.0976 16.6834 18.0976 17.3166 17.7071 17.7071C17.3166 18.0976 16.6834 18.0976 16.2929 17.7071L11.4765 12.8907Z"
      />
    </Svg>
  );
}

export function NearestIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="#878E92" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10ZM10.5 5.5C10.5 5.22386 10.2761 5 10 5C9.72386 5 9.5 5.22386 9.5 5.5V10C9.5 10.2761 9.72386 10.5 10 10.5H14.5C14.7761 10.5 15 10.2761 15 10C15 9.72386 14.7761 9.5 14.5 9.5H10.5V5.5Z"
      />
    </Svg>
  );
}

export function TicketingIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="#878E92" {...props}>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.5 4C2.22386 4 2 4.22386 2 4.5V8.07567C2 8.32442 2.25125 8.5 2.5 8.5C3.32843 8.5 4 9.17157 4 10C4 10.8284 3.32843 11.5 2.5 11.5C2.25125 11.5 2 11.6756 2 11.9243V15.5C2 15.7761 2.22386 16 2.5 16H17.5C17.7761 16 18 15.7761 18 15.5V11.9243C18 11.6756 17.7488 11.5 17.5 11.5C16.6716 11.5 16 10.8284 16 10C16 9.17157 16.6716 8.5 17.5 8.5C17.7488 8.5 18 8.32442 18 8.07567V4.5C18 4.22386 17.7761 4 17.5 4H2.5ZM9.5 8C9.5 7.72386 9.72386 7.5 10 7.5C10.2761 7.5 10.5 7.72386 10.5 8V9.5H12C12.2761 9.5 12.5 9.72386 12.5 10C12.5 10.2761 12.2761 10.5 12 10.5H10.5V12C10.5 12.2761 10.2761 12.5 10 12.5C9.72386 12.5 9.5 12.2761 9.5 12V10.5H8C7.72386 10.5 7.5 10.2761 7.5 10C7.5 9.72386 7.72386 9.5 8 9.5H9.5V8Z"
      />
    </Svg>
  );
}

export function ProfileIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="#878E92" {...props}>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10ZM2 18C2 14.8595 3.80956 12.1417 6.44288 10.8324C7.43823 11.5663 8.66846 12 10 12C11.3315 12 12.5618 11.5663 13.5571 10.8324C16.1904 12.1417 18 14.8595 18 18H2Z"
      />
    </Svg>
  );
}
