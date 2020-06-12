import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgTrainSide(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" viewBox="0 0 40 40" {...props}>
      <Path
        fill="#000"
        fillRule="evenodd"
        d="M18.414 8a1 1 0 100 2H20l-2 2H4v12h28.764a2 2 0 001.789-1.106l.802-1.605a2 2 0 00-.374-2.308l-6.395-6.395A2 2 0 0027.172 12h-6.344l2.293-2.293A1 1 0 0022.414 8h-4zm8.5 6c-.89 0-1.337 1.077-.707 1.707l1 1a1 1 0 00.707.293h.172c.89 0 1.337-1.077.707-1.707l-1-1a1 1 0 00-.707-.293h-.172zM4 28h30v-2H4v2z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgTrainSide;
