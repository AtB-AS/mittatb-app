import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgAssistant(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="#007C92" viewBox="0 0 20 20" {...props}>
      <Path
        fillRule="evenodd"
        d="M12 8a4 4 0 11-8 0 4 4 0 018 0zm-.524 4.89a6 6 0 111.414-1.414l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgAssistant;
