import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgMapIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.8866 8.98975C12.4877 8.1422 13 7.09788 13 6C13 4.34315 11.6569 3 10 3C8.34315 3 7 4.34315 7 6C7 7.0281 7.44922 8.00923 8 8.8258C8.02745 8.86649 8.05516 8.90678 8.08307 8.94665C8.94238 10.1739 10 11 10 11C9.38445 11.7881 9.38423 11.7879 9.384 11.7877L9.38221 11.7863L9.37886 11.7837L9.36893 11.7758L9.33662 11.7499C9.30974 11.7281 9.27235 11.6974 9.22597 11.6582C9.1333 11.58 9.00419 11.4676 8.85077 11.3251C8.61356 11.1048 8.31428 10.8089 8 10.4522V15.9843L12 16.8986V10.4522C11.6857 10.8089 11.3864 11.1048 11.1492 11.3251C10.9958 11.4676 10.8667 11.58 10.774 11.6582C10.7276 11.6974 10.6903 11.7281 10.6634 11.7499L10.6311 11.7758L10.6211 11.7837L10.6178 11.7863L10.616 11.7877C10.6158 11.7879 10.6155 11.7881 10 11C10 11 11.0329 10.1932 11.8866 8.98975ZM10 11L10.6155 11.7881L10 12.2689L9.38445 11.7881L10 11ZM11 6C11 6.55228 10.5523 7 10 7C9.44772 7 9 6.55228 9 6C9 5.44772 9.44772 5 10 5C10.5523 5 11 5.44772 11 6ZM17.6114 15.8446L13 16.8986V9.12187C13.0254 9.08114 13.0507 9.03998 13.0757 8.99838L17.3886 8.01257C17.537 7.97866 17.6927 8.01417 17.8117 8.10904C17.9307 8.20391 18 8.34781 18 8.5V15.3571C18 15.5904 17.8388 15.7926 17.6114 15.8446ZM7 9.12187C6.82336 8.83908 6.65617 8.53501 6.51087 8.21319L2.38859 9.15543C2.16123 9.2074 2 9.40964 2 9.64286V16.5C2 16.6522 2.06931 16.7961 2.18832 16.891C2.30732 16.9858 2.46305 17.0213 2.61141 16.9874L7 15.9843V9.12187Z"
        fill="black"
      />
    </Svg>
  );
}

export default SvgMapIcon;
