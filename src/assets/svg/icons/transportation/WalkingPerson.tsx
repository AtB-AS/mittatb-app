import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgWalkingPerson(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" {...props}>
      <Path
        fill="#000"
        fillRule="evenodd"
        d="M25 7a3 3 0 11-6 0 3 3 0 016 0zm-6.515 3.56a2 2 0 00-.97 0l-4 1a2 2 0 00-1.304 1.046l-3 6a2 2 0 103.578 1.788l2.588-5.177 1.09-.272-.926 5.562c-.155.928.176 1.929.948 2.803l.04.045c.105.116.217.229.337.34l3.49 3.49 3.855 7.71a2 2 0 103.578-1.79l-4-8a2.001 2.001 0 00-.375-.52l-2.131-2.13c.32-1.79.616-3.582.913-5.375l.01-.058 1.715 2.206a2 2 0 00.791.61l3.5 1.5a2 2 0 101.576-3.676l-3.026-1.297-3.183-4.093a2 2 0 00-1.094-.712l-4-1zm-.994 16.93l-2.982-2.98-4.298 8.596a2 2 0 103.578 1.788l3.702-7.403z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgWalkingPerson;
