import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  Ellipse,
  Circle,
  Rect,
  G,
  Defs,
  ClipPath,
} from 'react-native-svg';

function SvgOnboarding1_2(props: SvgProps) {
  return (
    <Svg viewBox="0 30 320 180" fill="none" {...props}>
      <Path
        d="M32.844 133.25C19.6367 141.635 8.02029 151.714 0.0172738 160L0 116.892C5.11018 112.844 10.2402 109.178 15.3729 105.914L16.1213 105.419C23.6859 100.269 31.7961 95.9744 40.9118 92.2922C68.1991 81.2659 99.6787 77.9148 133.003 74.3706L133.107 74.3596C139.937 73.6333 146.992 72.8828 154.137 72.0474C185.879 68.3401 231.764 60.6687 270.137 45.168L271.869 44.2688C294.848 33.4556 313.03 19.7549 320 0L320 54.1558C307.174 63.4724 296.354 69.573 282.259 75.2683C240.546 92.1199 191.606 100.349 157.892 104.287C150.721 105.126 143.715 105.871 136.931 106.593L136.779 106.609L136.707 106.616L136.431 106.646C105.415 109.945 76.1241 113.062 53.0342 122.394C46.0512 125.214 39.9079 128.461 34.2519 132.321L34.0427 132.463L32.844 133.25Z"
        fill="#71D6E0"
      />
      <Path
        d="M102.5 83H42L42.0073 82.9875C36.9895 82.7311 33 78.5815 33 73.5C33 68.2533 37.2532 64 42.5 64C44.6931 64 46.7124 64.743 48.3203 65.9911C48.1106 65.0274 48 64.0266 48 63C48 55.268 54.2681 49 62 49C66.9883 49 71.3672 51.6089 73.8469 55.5366C76.4038 52.1722 80.4482 50 85 50C92.2668 50 98.2405 55.5365 98.9329 62.6214C100.046 62.2192 101.248 62 102.5 62C108.299 62 113 66.701 113 72.5C113 78.299 108.299 83 102.5 83Z"
        fill="#D4F3F6"
      />
      <Path
        d="M196 99C218.091 99 236 81.0914 236 59C236 36.9086 218.091 19 196 19C182.443 19 170.461 25.7444 163.227 36.0609C162.49 36.0205 161.747 36 161 36C138.909 36 121 53.9086 121 76C121 98.0914 138.909 116 161 116C174.557 116 186.539 109.256 193.773 98.9391C194.51 98.9795 195.253 99 196 99Z"
        fill="#B3D8DE"
      />
      <Path
        d="M165.783 92.0712C163.994 88.0803 163 83.6563 163 79C163 61.3269 177.327 47 195 47C210.43 47 223.309 57.9204 226.33 72.4539C232.03 67.2053 239.641 64 248 64C265.673 64 280 78.3269 280 96C280 111.982 268.284 125.227 252.972 127.616C252.991 128.075 253 128.536 253 129C253 147.778 237.778 163 219 163C208.103 163 198.404 157.874 192.181 149.901C186.018 156.136 177.46 160 168 160C149.222 160 134 144.778 134 126C134 107.967 148.038 93.2134 165.783 92.0712Z"
        fill="#99CBD3"
      />
      <Path
        d="M190.516 126.269L141 51.5L142 50L190.596 114.794L191 57L197 54V97.4423L221.5 72L223.5 74L197 107.125V134.817L250 93L251.5 79.5H253.5L254.5 89L261.5 84L264 87L256.5 93L272.5 90L273.5 93L247.5 101L197 144.702V192H190L190.271 161.262L150.5 120L151.5 118L190.346 150.533L190.516 126.269Z"
        fill="#37424A"
      />
      <Path
        d="M218.751 102.939L217.755 102.719C217.427 102.646 217.084 102.727 216.824 102.939L209.11 109.228C208.828 109.458 208.678 109.814 208.71 110.178L208.789 111.062L193.94 123.167C193.846 123.244 193.832 123.383 193.91 123.478L199.367 130.172C199.637 130.503 200.124 130.554 200.454 130.285L202.148 128.904C201.98 128.794 201.825 128.656 201.691 128.491C200.995 127.638 201.119 126.386 201.967 125.694C202.815 125.003 204.067 125.134 204.763 125.987C204.897 126.151 205 126.331 205.074 126.518L221.861 112.833C221.692 112.723 221.537 112.585 221.403 112.42C220.707 111.567 220.831 110.315 221.68 109.623C222.528 108.932 223.779 109.063 224.475 109.916C224.609 110.08 224.713 110.26 224.787 110.447L226.566 108.996C226.896 108.727 226.944 108.24 226.674 107.909L221.217 101.215C221.139 101.12 221 101.105 220.906 101.182L218.751 102.939Z"
        fill="#A2AD00"
      />
      <Path
        d="M196.664 121.803C196.57 121.88 196.556 122.019 196.633 122.114L199.152 125.204C199.229 125.299 199.368 125.313 199.463 125.236L204.327 121.271C204.421 121.194 204.435 121.055 204.358 120.96L201.839 117.87C201.762 117.776 201.622 117.761 201.528 117.838L196.664 121.803Z"
        fill="#EAF7F8"
      />
      <Path
        d="M202.351 117.453C202.274 117.358 202.287 117.219 202.382 117.142L207.246 113.177C207.34 113.1 207.479 113.114 207.556 113.209L210.075 116.299C210.152 116.393 210.139 116.532 210.044 116.609L205.18 120.575C205.086 120.652 204.947 120.637 204.87 120.542L202.351 117.453Z"
        fill="#EAF7F8"
      />
      <Path
        d="M208.099 112.481C208.005 112.558 207.991 112.697 208.068 112.792L210.587 115.881C210.664 115.976 210.803 115.99 210.898 115.914L215.762 111.948C215.856 111.871 215.87 111.732 215.792 111.637L213.274 108.548C213.196 108.453 213.057 108.438 212.963 108.515L208.099 112.481Z"
        fill="#EAF7F8"
      />
      <Path
        d="M213.786 108.13C213.708 108.036 213.722 107.896 213.816 107.82L218.681 103.854C218.775 103.777 218.914 103.792 218.991 103.886L221.51 106.976C221.587 107.071 221.573 107.21 221.479 107.287L216.615 111.252C216.521 111.329 216.382 111.315 216.304 111.22L213.786 108.13Z"
        fill="#EAF7F8"
      />
      <Path
        d="M219.759 103.26C219.682 103.166 219.696 103.026 219.79 102.95L221.497 101.558L225.345 106.278L223.638 107.67C223.544 107.746 223.405 107.732 223.327 107.637L219.759 103.26Z"
        fill="#EAF7F8"
      />
      <Ellipse
        cx="203.227"
        cy="127.239"
        rx="1.65152"
        ry="1.66086"
        transform="rotate(-39.1897 203.227 127.239)"
        fill="#37424A"
      />
      <Ellipse
        cx="222.939"
        cy="111.168"
        rx="1.65152"
        ry="1.66086"
        transform="rotate(-39.1897 222.939 111.168)"
        fill="#37424A"
      />
      <Path
        d="M206 62C204.895 62 204 62.8954 204 64V76C204 77.1046 204.895 78 206 78L206 89H208V78C209.105 78 210 77.1046 210 76V64C210 62.8954 209.105 62 208 62H206Z"
        fill="#37424A"
      />
      <Circle cx="207" cy="75" r="2" fill="#878E92" />
      <Circle cx="207" cy="70" r="2" fill="#AFB3B7" />
      <Circle cx="207" cy="65" r="2" fill="#C3C6C9" />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M231 72C229.167 73.8333 227.5 78.9999 228.5 83C229.474 86.8955 235.307 90.0615 237.5 90.5C237.971 90.5942 238.478 90.6707 239 90.7093C239.8 92.4768 242 94.3062 243 95L244 93.5C242.845 93.1138 240.982 92.0072 240.768 90.6707C242.467 90.4466 244.097 89.6083 245 87.5C246.5 84 244 82 243 81.5C242 81 238.5 80.5 237 84C235.73 86.9642 237.167 88.8333 237.5 89C236 88.6667 232.5 86 231 83.5C230.16 82.1006 229 79.5 233 72H231ZM239.5 89C239 88.5 238.1 87.1 238.5 85.5C239 83.5 240 83 241 83C243.179 83 244.5 85 243 87C241.642 88.8102 240 89 239.5 89Z"
        fill="#A51140"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M233.227 101.005C232.263 101.264 231.416 101.768 230.837 102.426C230.265 103.078 229.884 103.982 230.14 104.939C230.396 105.895 231.179 106.488 232 106.766C232.83 107.046 233.816 107.059 234.78 106.801C235.744 106.543 236.592 106.038 237.17 105.38C237.453 105.058 237.69 104.674 237.825 104.252L248.417 101.378C249.091 101.195 249.705 100.839 250.198 100.346L250.898 99.646L237.633 102.299C237.272 101.67 236.651 101.259 236.007 101.041C235.178 100.76 234.192 100.747 233.227 101.005ZM232.072 104.421C232.042 104.311 232.051 104.075 232.34 103.746C232.623 103.424 233.109 103.108 233.745 102.937C234.381 102.767 234.96 102.798 235.366 102.935C235.781 103.076 235.906 103.276 235.936 103.386C235.965 103.496 235.956 103.731 235.668 104.06C235.384 104.382 234.899 104.699 234.262 104.869C233.626 105.04 233.048 105.009 232.641 104.871C232.227 104.731 232.101 104.531 232.072 104.421Z"
        fill="black"
      />
      <Path
        d="M242.495 95.7822C242.724 94.9403 243.168 94.1728 243.785 93.556L244.297 93.0445L242.753 100.765L241.051 101.106L242.495 95.7822Z"
        fill="black"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M241.644 106.31C242.273 106.671 242.684 107.291 242.902 107.936C243.182 108.765 243.196 109.751 242.937 110.715C242.679 111.68 242.174 112.527 241.517 113.105C240.865 113.678 239.961 114.059 239.004 113.803C238.047 113.546 237.455 112.764 237.177 111.942C236.896 111.113 236.883 110.127 237.142 109.163C237.4 108.198 237.905 107.351 238.562 106.773C238.885 106.489 239.269 106.253 239.691 106.117L240.234 104.116L242.188 103.586L241.644 106.31ZM239.522 111.871C239.632 111.9 239.868 111.892 240.196 111.603C240.519 111.32 240.835 110.834 241.005 110.198C241.176 109.562 241.145 108.983 241.007 108.576C240.867 108.162 240.667 108.037 240.557 108.007C240.447 107.978 240.211 107.986 239.883 108.275C239.56 108.558 239.244 109.044 239.074 109.68C238.903 110.316 238.934 110.895 239.072 111.302C239.212 111.716 239.412 111.841 239.522 111.871Z"
        fill="black"
      />
      <Path
        d="M250.5 104.5C248.5 102.9 249 100.167 249.5 99C246 104 250.409 107.902 254 108.5C257 109 258 108 263 108.5C263.995 108.6 267.5 110.5 267.5 113.5C267.5 115.9 269.167 117.167 270 117.5L270.5 115C268.596 115 269 110.5 267 108.5C264.736 106.236 262 106 259 106.5C256 107 253 106.5 250.5 104.5Z"
        fill="#A51140"
      />
      <Ellipse
        cx="146.884"
        cy="52.0709"
        rx="2.08528"
        ry="2.1579"
        transform="rotate(53.5068 146.884 52.0709)"
        fill="#37424A"
      />
      <Ellipse
        cx="178.658"
        cy="95.0217"
        rx="2.08527"
        ry="2.1579"
        transform="rotate(53.5068 178.658 95.0217)"
        fill="#37424A"
      />
      <Path
        d="M143.791 44.6105C147.914 41.5603 153.729 42.4301 156.779 46.5532L186.787 87.1171C189.837 91.2402 188.968 97.0553 184.844 100.106C183.814 100.868 182.36 100.651 181.597 99.6199L143.305 47.8576C142.542 46.8268 142.76 45.3731 143.791 44.6105Z"
        fill="#37424A"
      />
      <Path
        d="M188.655 92.4568L190.002 94.2777C190.184 94.5234 190.134 94.871 189.895 95.0712L189.874 95.0431C189.827 94.9793 189.735 94.9672 189.669 95.016L188.413 95.9454C188.346 95.9942 188.331 96.0856 188.378 96.1495L188.464 96.2651C188.511 96.329 188.603 96.3411 188.669 96.2922L189.925 95.3629C189.981 95.3215 190.001 95.2496 189.977 95.1898C190.285 94.9411 190.351 94.4999 190.121 94.1892L188.774 92.3682L188.655 92.4568Z"
        fill="#37424A"
      />
      <Path
        d="M183.534 100.606C182.832 100.642 182.135 100.346 181.695 99.752L143.207 47.7255C142.498 46.7677 142.728 45.3968 143.719 44.6636L144.078 44.3981C144.402 44.158 144.737 43.9425 145.08 43.7512L185.041 97.7688C184.887 98.4619 184.391 99.8622 183.534 100.606Z"
        fill="#A2AD00"
      />
      <Rect
        x="153.174"
        y="47.0603"
        width="4.17055"
        height="3.42287"
        transform="rotate(53.5068 153.174 47.0603)"
        fill="#EAF7F8"
      />
      <Rect
        x="164.977"
        y="63.0151"
        width="4.17056"
        height="3.42287"
        transform="rotate(53.5068 164.977 63.0151)"
        fill="#EAF7F8"
      />
      <Rect
        x="176.78"
        y="78.9699"
        width="4.17055"
        height="3.42287"
        transform="rotate(53.5068 176.78 78.9699)"
        fill="#EAF7F8"
      />
      <Rect
        x="156.168"
        y="51.1069"
        width="4.17055"
        height="3.42287"
        transform="rotate(53.5068 156.168 51.1069)"
        fill="#EAF7F8"
      />
      <Rect
        x="167.971"
        y="67.0617"
        width="4.17056"
        height="3.42287"
        transform="rotate(53.5068 167.971 67.0617)"
        fill="#EAF7F8"
      />
      <Rect
        x="179.774"
        y="83.0165"
        width="4.17055"
        height="3.42287"
        transform="rotate(53.5068 179.774 83.0165)"
        fill="#EAF7F8"
      />
      <Rect
        x="159.161"
        y="55.1533"
        width="4.17055"
        height="3.42287"
        transform="rotate(53.5068 159.161 55.1533)"
        fill="#EAF7F8"
      />
      <Rect
        x="170.964"
        y="71.1081"
        width="4.17055"
        height="3.42287"
        transform="rotate(53.5068 170.964 71.1081)"
        fill="#EAF7F8"
      />
      <Rect
        x="182.767"
        y="87.063"
        width="4.17054"
        height="3.42287"
        transform="rotate(53.5068 182.767 87.063)"
        fill="#EAF7F8"
      />
      <Path
        d="M185.6 91.2284C185.689 91.1627 185.814 91.1814 185.88 91.2702L187.116 92.9416C187.591 93.5838 187.638 94.447 187.237 95.1373L186.177 96.9579C186.104 97.0821 185.928 97.0918 185.843 96.9762L183.128 93.3059C183.062 93.2171 183.081 93.0919 183.17 93.0262L185.6 91.2284Z"
        fill="#EAF7F8"
      />
      <Rect
        x="176.53"
        y="73.2517"
        width="3.88293"
        height="11.608"
        transform="rotate(53.5068 176.53 73.2517)"
        fill="#AFB3B7"
      />
      <Rect
        x="164.727"
        y="57.2969"
        width="3.88293"
        height="11.608"
        transform="rotate(53.5068 164.727 57.2969)"
        fill="#AFB3B7"
      />
      <Ellipse
        cx="185.362"
        cy="98.5153"
        rx="0.179764"
        ry="0.186027"
        transform="rotate(53.5068 185.362 98.5153)"
        fill="#E4D700"
      />
      <G clip-path="url(#clip0)">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M83.0787 101.228C82.4056 100.664 81.8684 99.9558 81.507 99.1565C81.1435 98.3526 80.9673 97.4771 80.9916 96.5956C81.1744 93.4783 84.5393 91.2787 88.2021 91.5014C88.2021 91.5014 92.7963 90.7844 93.7108 95.975C93.9343 96.825 93.9136 97.3865 93.885 98.1576C93.8741 98.4519 93.8621 98.7766 93.8621 99.1596C93.8621 99.1596 94.1803 99.7669 93.8621 101.393C93.4356 103.741 92.2914 106.028 91.4451 106.359C91.2894 106.421 90.861 106.392 90.2874 106.299V109.854C90.2874 109.854 94.1397 110.05 94.9522 110.414C94.9522 110.414 93.8486 114.672 88.0938 115.097C84.0424 115.396 79.2847 110.781 78.958 110.459C80.2883 110.148 81.6443 109.959 83.0092 109.895C83.3465 109.761 83.652 109.559 83.9062 109.301C84.0894 109.115 84.243 108.903 84.3622 108.673C84.3279 108.734 84.2922 108.792 84.255 108.849C84.255 108.849 81.5469 107.83 81.6146 105.03C81.6756 102.505 82.8488 101.417 83.0787 101.228ZM78.958 110.459L78.947 110.461L78.9402 110.441L78.958 110.459ZM83.1112 101.202L83.1176 101.197L83.171 101.231C83.1671 101.193 83.1636 101.156 83.1604 101.118L83.1112 101.202ZM102.156 114.51C102.156 114.51 103.354 113.956 103.307 115.292L103.984 118.079L102.684 115.232L102.156 114.51ZM103.916 121.304L103.747 118.167L98.4727 122.303C98.4727 122.303 98.6488 120.387 98.6081 119.273L96.1166 120.103L94.8167 122.62L94.4511 127.471C94.4724 128.029 94.6611 128.567 94.9927 129.016C94.9927 129.016 98.5472 128.456 100.24 126.453C101.563 124.808 102.79 123.089 103.916 121.304ZM107.493 116.581C107.62 116.8 107.801 116.984 108.019 117.114C108.353 116.847 108.617 116.503 108.786 116.11C108.956 115.718 109.026 115.291 108.991 114.865C108.957 114.44 108.818 114.029 108.587 113.67C108.356 113.31 108.04 113.012 107.667 112.803C107.304 113.778 107.176 114.825 107.295 115.859C107.298 116.113 107.366 116.361 107.493 116.581ZM75.4602 120.832C75.4602 120.832 75.6972 125.926 75.7513 127.208C75.7513 127.208 74.7836 131.739 76.7475 141.96L75.8732 146.323C75.8732 146.323 78.9673 149.522 79.4209 149.07C79.8745 148.618 78.6829 144.88 78.6829 144.88L79.1974 143.409L78.7159 142.022C78.8158 139.991 79.2602 130.574 79.0553 127.613L79.8948 123.16L75.4602 120.832Z"
          fill="#37424A"
        />
        <Path
          d="M102.758 111.075L103.842 121.075H107.714L108.446 110.988L102.758 111.075Z"
          fill="#555E65"
        />
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M98.4728 121.992V122.303H98.4525C96.2657 122.789 94.5595 125.845 94.5595 125.845L94.7153 123.639C95.7647 122.033 98.4728 121.992 98.4728 121.992ZM97.8566 127.822L98.4803 135.026C97.6559 134.968 96.8287 134.948 96.0016 134.968L97.816 148.037L99.8471 146.856L100.897 135.312C100.415 135.232 99.9311 135.166 99.4461 135.113L99.1904 127.013L97.8566 127.822Z"
          fill="#555E65"
        />
        <Path
          d="M78.6152 140.953C78.6152 140.953 79.7797 151.458 81.1812 154.987C82.0483 157.317 82.4686 159.789 82.4202 162.274C82.4202 162.274 81.5062 168.158 81.5874 170.769C81.6687 173.657 83.2462 179.723 83.2462 179.723H87.2069L87.5454 162.564L87.9922 161.397L88.8385 143.483C88.8385 143.483 88.4729 147.707 93.0429 158.786C93.0429 158.786 91.6482 163.441 91.2623 165.668C90.8764 167.895 90.9509 174.305 90.9644 175.317L94.8371 175.782L98.0801 160.607L98.879 158.833C98.879 158.833 99.4206 146.364 97.3286 140.264L78.6152 140.953Z"
          fill="#B6CDD3"
        />
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M90.1181 184.891C91.2555 182.759 90.9847 175.337 90.9847 175.337L94.8371 175.762C94.8371 175.762 93.483 182.732 93.483 183.589C93.5336 184.255 93.6819 184.909 93.9231 185.532C92.5013 185.6 90.7274 187.151 90.7274 187.151L90.1181 184.891ZM87.2948 187.097L87.2068 179.736L83.2462 179.723C83.8611 182.338 84.1947 185.012 84.2414 187.698C84.1963 188.237 84.0802 188.768 83.8961 189.277C83.8961 189.277 84.5122 189.918 85.02 189.918C86.1468 189.702 87.2611 189.424 88.3578 189.088L87.2948 187.097Z"
          fill="#E7E8E9"
        />
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M89.2312 186.956L90.1181 184.763L90.1587 184.709C90.2873 186.025 90.8696 186.139 90.8696 186.139C90.8696 186.139 92.0409 185.478 92.3997 185.343C92.897 185.234 93.4122 185.234 93.9095 185.343C93.982 185.995 94.1134 186.638 94.3022 187.266L95.7646 189.493C96.3223 189.708 96.8556 189.982 97.3556 190.309C97.7551 191.315 96.164 191.213 96.164 191.213C94.6408 191.178 93.1281 190.951 91.6617 190.539C91.1513 189.801 90.6986 189.025 90.3077 188.218L89.2312 186.956ZM84.0925 188.805C83.7743 189.672 83.5872 190.581 83.5373 191.503C83.842 191.584 84.285 191.792 84.6638 191.969C84.9499 192.104 85.1994 192.22 85.3247 192.252C85.4272 192.279 85.7755 192.503 86.2099 192.783C87.0094 193.297 88.1004 194 88.4865 194C89.3395 193.98 93.3544 193.48 93.3544 193.48C93.3544 193.48 93.5981 192.61 93.1513 192.475C91.8273 191.969 90.5719 191.3 89.414 190.485L87.999 188.643C87.2773 188.591 86.4764 189.032 85.9131 189.341C85.5887 189.52 85.3431 189.655 85.2367 189.628C84.8237 189.4 84.4396 189.123 84.0925 188.805Z"
          fill="#555E65"
        />
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M92.2034 102.203L90.7613 102.763L90.7409 102.783C90.7806 102.786 90.8202 102.789 90.8598 102.792C91.3462 103.108 91.8899 103.328 92.4607 103.437C92.9414 103.377 92.7721 102.817 92.7721 102.817L92.7721 102.817C92.8872 102.709 92.833 102.142 92.833 102.142L92.2034 102.203Z"
          fill="white"
        />
        <Path
          d="M79.4141 150.702L77.4439 149.913C77.3514 149.876 77.2672 149.821 77.1962 149.751C77.1252 149.682 77.0688 149.598 77.0304 149.507C76.992 149.415 76.9722 149.317 76.9723 149.217C76.9724 149.118 76.9923 149.02 77.0309 148.928L79.3126 143.301C79.3497 143.208 79.4049 143.125 79.4749 143.054C79.5449 142.983 79.6283 142.927 79.7203 142.889C79.8123 142.85 79.911 142.831 80.0107 142.831C80.1104 142.831 80.2091 142.851 80.301 142.889L82.2577 143.672C82.4439 143.75 82.5922 143.897 82.6707 144.082C82.7491 144.268 82.7516 144.476 82.6775 144.664L80.3891 150.284C80.3518 150.376 80.2967 150.46 80.2268 150.531C80.157 150.602 80.0738 150.659 79.9819 150.698C79.8901 150.737 79.7915 150.757 79.6917 150.758C79.592 150.759 79.493 150.74 79.4006 150.702"
          fill="#555E65"
        />
        <Path
          d="M78.9199 110.421C78.9199 110.421 77.3424 110.758 76.9768 111.71C76.1892 114.702 75.6815 117.76 75.4602 120.846C75.9944 121.522 76.6653 122.078 77.4293 122.479C78.1932 122.88 79.0332 123.117 79.8948 123.173L80.6937 126.466C80.6937 126.466 78.1954 134.178 78.0668 141.357C78.0668 141.357 90.8493 141.985 97.5181 140.386C97.5181 140.386 96.1641 131.817 94.4579 127.532L94.8168 122.634C94.8168 122.634 96.1031 121.082 96.1167 120.117C97.0481 119.921 97.9559 119.627 98.8248 119.24C98.8248 119.24 97.8364 112.249 94.9657 110.468C94.9657 110.468 93.246 114.139 87.8162 114.132C86.1587 114.144 84.5158 113.822 82.9868 113.184C81.4577 112.546 80.0743 111.606 78.9199 110.421Z"
          fill="#8FB4BE"
        />
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M83.7376 101.506C83.7376 101.506 83.7376 101.506 83.8623 101.514C83.987 101.523 83.987 101.523 83.987 101.523L83.9845 101.561L83.9773 101.672C83.9709 101.77 83.9617 101.915 83.9501 102.103C83.9269 102.48 83.8943 103.028 83.8566 103.716C83.7811 105.092 83.685 107.025 83.603 109.254C83.4388 113.714 83.3307 119.357 83.5538 124.098C83.565 124.33 83.5735 124.571 83.5794 124.82C83.6542 124.685 83.7576 124.495 83.8877 124.247C84.1824 123.687 84.614 122.835 85.1607 121.668C86.2542 119.333 87.8082 115.739 89.6485 110.702C90.1467 109.298 90.4096 107.821 90.4265 106.331L90.6764 106.333C90.6593 107.851 90.3915 109.356 89.8839 110.787L89.8835 110.788C88.0407 115.831 86.4838 119.433 85.3871 121.774C84.8388 122.945 84.4054 123.8 84.109 124.364C83.9607 124.646 83.8467 124.854 83.7696 124.993C83.731 125.062 83.7017 125.114 83.682 125.148L83.6596 125.187L83.6539 125.197L83.6524 125.199L83.6519 125.2C83.6518 125.2 83.6518 125.2 83.5857 125.161C83.6164 127.439 83.4377 130.343 83.0595 133.234C82.6241 136.563 81.9226 139.885 80.9659 142.215L80.9762 142.218L80.6642 143.039L80.411 142.943L80.7229 142.123L80.732 142.126C81.6777 139.826 82.3767 136.526 82.8117 133.201C83.2502 129.849 83.4188 126.483 83.3041 124.111C83.0805 119.359 83.1889 113.707 83.3532 109.245C83.4353 107.014 83.5314 105.079 83.6069 103.702C83.6447 103.014 83.6774 102.465 83.7006 102.088C83.7122 101.9 83.7214 101.754 83.7278 101.656L83.7351 101.544L83.7376 101.506Z"
          fill="black"
        />
      </G>
      <Defs>
        <ClipPath id="clip0">
          <Rect
            width="34"
            height="103"
            fill="white"
            transform="translate(75 91)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SvgOnboarding1_2;
