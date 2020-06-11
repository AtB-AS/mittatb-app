import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';
import colors from '../../theme/colors';

function HomeBanner(props: SvgProps) {
  return (
    <Svg
      width={375}
      height={96}
      viewBox="0 0 375 96"
      fill={colors.secondary.cyan}
      {...props}
    >
      <Path d="M365.984 56.016h-4.968V48h-3L368 39l9.984 9h-3v8.016h-4.968v-6h-4.032v6zM332 39.984L340.016 48 332 56.016l-1.406-1.407 5.578-5.625h-12.188v-1.968h12.188l-5.578-5.625L332 39.984zM301.875 51v2.016h-2.016V51h2.016zm0-3.984v1.968h-2.016v-1.968h2.016zm2.016 7.968V45h-8.016v2.016h2.016v1.968h-2.016V51h2.016v2.016h-2.016v1.968h8.016zm-10.032-12v-1.968h-1.968v1.968h1.968zm0 4.032V45h-1.968v2.016h1.968zm0 3.984v-2.016h-1.968V51h1.968zm0 3.984v-1.968h-1.968v1.968h1.968zm-3.984-12v-1.968h-2.016v1.968h2.016zm0 4.032V45h-2.016v2.016h2.016zm0 3.984v-2.016h-2.016V51h2.016zm0 3.984v-1.968h-2.016v1.968h2.016zm6-12h9.984V57h-19.968V39h9.984v3.984zM260 39.984L268.016 48 260 56.016l-1.406-1.407 5.578-5.625h-12.188v-1.968h12.188l-5.578-5.625L260 39.984zM179.938 80.063h-19.876V48h-12L188 12l39.938 36h-12v32.063h-19.876v-24h-16.124v24zM116 39.984L124.016 48 116 56.016l-1.406-1.407 5.578-5.625h-12.188v-1.968h12.188l-5.578-5.625L116 39.984zM85.875 51v2.016h-2.016V51h2.016zm0-3.984v1.968h-2.016v-1.968h2.016zm2.016 7.968V45h-8.016v2.016h2.016v1.968h-2.016V51h2.016v2.016h-2.016v1.968h8.016zm-10.032-12v-1.968h-1.968v1.968h1.968zm0 4.032V45h-1.968v2.016h1.968zm0 3.984v-2.016h-1.968V51h1.968zm0 3.984v-1.968h-1.968v1.968h1.968zm-3.984-12v-1.968h-2.016v1.968h2.016zm0 4.032V45h-2.016v2.016h2.016zm0 3.984v-2.016h-2.016V51h2.016zm0 3.984v-1.968h-2.016v1.968h2.016zm6-12h9.984V57H69.891V39h9.984v3.984zM44 39.984L52.016 48 44 56.016l-1.406-1.407 5.578-5.625H35.984v-1.968h12.188l-5.578-5.625L44 39.984zM5.984 56.016H1.016V48h-3L8 39l9.984 9h-3v8.016h-4.968v-6H5.984v6z" />
    </Svg>
  );
}

export default HomeBanner;
