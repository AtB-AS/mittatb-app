import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgFavorite(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 20 20" {...props}>
      <Path
        fillRule="evenodd"
        d="M10 1.5a1 1 0 01.951.691l1.572 4.837h5.085a1 1 0 01.588 1.809l-4.114 2.99 1.571 4.836a1 1 0 01-1.539 1.118L10 14.791l-4.114 2.99a1 1 0 01-1.54-1.118l1.572-4.837-4.114-2.99a1 1 0 01.588-1.808h5.085L9.05 2.19A1 1 0 0110 1.5zm0 4.236l-.845 2.6a1 1 0 01-.951.692H5.469l2.213 1.607a1 1 0 01.363 1.118L7.2 14.354l2.212-1.607a1 1 0 011.176 0l2.212 1.607-.845-2.6a1 1 0 01.363-1.119l2.213-1.607h-2.735a1 1 0 01-.95-.691L10 5.737z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgFavorite;
