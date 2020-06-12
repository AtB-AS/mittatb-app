import * as React from 'react';
import Svg, {Path, SvgProps, Circle} from 'react-native-svg';

function WalkingPerson(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 40 40" fill="#000" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.515 10.56a2 2 0 01.97 0l4 1a2 2 0 011.094.712l3.183 4.093 3.026 1.297a2 2 0 11-1.576 3.676l-3.5-1.5a2 2 0 01-.79-.61l-2.534-3.257-1.197 5.391 3.223 3.224c.152.152.279.327.375.52l4 8a2 2 0 01-3.578 1.788l-3.855-7.71-3.77-3.77a2 2 0 01-.538-1.848l1.533-6.9-2.204.551-2.588 5.177a2 2 0 01-3.578-1.788l3-6a2 2 0 011.304-1.046l4-1z"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.993 12.04a3 3 0 012.466 3.453C21.986 18.331 21.53 21.172 21 24c-.656.828-.884 1.186-2 1-2.5-1-3.732-2.859-3.46-4.493l1-6a3 3 0 013.453-2.466z"
      />
      <Circle cx={22} cy={7} r={3} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.51 24.51l2.98 2.98-3.701 7.404a2 2 0 01-3.578-1.788l4.298-8.597z"
      />
    </Svg>
  );
}

export default WalkingPerson;
