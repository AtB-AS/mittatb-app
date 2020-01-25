import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function WalkingPerson(props: SvgProps) {
  return (
    <Svg width={7} height={12} viewBox="0 0 7 12" fill="none" {...props}>
      <Path
        d="M1.898 4.453L.492 11.508h1.055L2.46 7.5l1.031 1.008v3H4.5v-3.75L3.445 6.75l.305-1.5c.719.828 1.633 1.242 2.742 1.242v-.984c-.969 0-1.68-.406-2.133-1.219l-.515-.797C3.609 3.164 3.328 3 3 3a1.41 1.41 0 00-.21.023c-.08.016-.142.024-.188.024L0 4.148v2.344h1.008V4.805l.89-.352zm2.555-1.992a1.006 1.006 0 01-.703.281c-.266 0-.5-.094-.703-.281a.966.966 0 01-.305-.703c0-.266.102-.5.305-.703A.966.966 0 013.75.75c.266 0 .5.102.703.305a.966.966 0 01.305.703c0 .265-.102.5-.305.703z"
        fill="#fff"
      />
    </Svg>
  );
}

export default WalkingPerson;
