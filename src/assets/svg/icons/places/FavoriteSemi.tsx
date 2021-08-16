import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgFavoriteSemi(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M21.902 4.382a2 2 0 00-3.804 0l-3.143 9.674H4.783a2 2 0 00-1.175 3.618l8.229 5.979-3.144 9.673a2 2 0 003.078 2.236L20 29.584l8.229 5.978a2 2 0 003.078-2.236l-3.143-9.674 8.228-5.978a2 2 0 00-1.175-3.618H25.045l-3.143-9.674zM20 25.112c.413 0 .825.127 1.176.381l4.424 3.215-1.69-5.201a2 2 0 01.727-2.237l4.424-3.214h-5.469a2 2 0 01-1.902-1.382L20 11.472v13.64z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgFavoriteSemi;
