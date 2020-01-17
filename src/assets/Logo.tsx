import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function Logo(props: SvgProps) {
  return (
    <Svg width={97} height={96} viewBox="0 0 97 96" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M42.15 31.864c1.695-.181 3.446-.369 5.222-.577h.004c10.113-1.18 24.795-3.651 37.307-8.706a49.67 49.67 0 0011.321-6.333v78.15a1.59 1.59 0 01-1.59 1.59H1.59A1.59 1.59 0 010 94.398V48.216a56.028 56.028 0 019.858-8.242l.358-.234.064-.044a29.405 29.405 0 015.634-2.976c6.926-2.801 15.715-3.739 25.021-4.724.402-.044.807-.087 1.216-.13zm39.41-18.553c6.894-3.246 11.71-7.35 13.804-13.283l-71.57.016A23.794 23.794 0 000 23.84v11.257A54.935 54.935 0 014.613 31.8l.227-.147a38.976 38.976 0 017.438-3.938c8.175-3.302 17.606-4.308 27.565-5.372l.04-.004c2.077-.218 4.203-.445 6.357-.695 9.524-1.113 23.277-3.413 34.8-8.062l.52-.27zM45.242 85.3c.68.517 1.94.998 4.324.998v-.004h25.93c1.862.043 3.715-.249 5.472-.863a9.315 9.315 0 003.668-2.384 9.586 9.586 0 002.038-3.687c.454-1.521.678-3.102.664-4.689a11.608 11.608 0 00-.398-3.063 8.994 8.994 0 00-1.295-2.782 7.626 7.626 0 00-2.26-2.126 7.407 7.407 0 00-3.31-1.02v-.112a7.211 7.211 0 002.812-1.16 7.056 7.056 0 001.904-2.015 8.944 8.944 0 001.104-2.646c.24-.985.36-1.995.358-3.008-.003-2.986-.877-5.37-2.623-7.153-1.745-1.782-4.456-2.674-8.133-2.674h-15.43v32.762h-4.47a2.607 2.607 0 01-1.792-.525c-.386-.347-.58-.944-.58-1.792V63.127h3.914v-6.675h-3.914v-8.77h-9.934v8.766H33.33l-2.337-9.537H18.08L8.646 86.293H19.4l1.049-6.894h8.161l1.053 6.886h10.935L34.94 63.119h8.344v15.894c-.037 1.348.12 2.695.47 3.998.239.902.761 1.704 1.49 2.288zM21.664 71.68l2.813-16.714h.127l2.813 16.713h-5.753zm52.444-9.604a2.781 2.781 0 01-1.369.281h-2.483v-8.054h2.483a2.75 2.75 0 012.428 1.212 4.96 4.96 0 01.826 2.869 4.736 4.736 0 01-.826 2.781c-.27.39-.635.703-1.06.911zm.425 16.506a3.38 3.38 0 01-1.397.321l-2.868-.004v-9.596h2.868a3.348 3.348 0 012.535 1.212c.737.808 1.105 1.984 1.105 3.528 0 1.65-.368 2.873-1.105 3.668-.312.368-.7.666-1.138.871z"
        fill="#fff"
      />
    </Svg>
  );
}

export default Logo;
