/* eslint-disable no-restricted-exports */

// these declarations allow import syntax for images
// instead of `const MyImg = require('./MyImg.png');`

/**
 * pngs can be imported as:
 *
 * `import MyImg from './MyImg.png';`
 */
declare module '*.png' {
  const img: string;
  export default img;
}

/**
 * jpgs can be imported as:
 *
 * `import MyImg from './MyImg.jpg';`
 */
declare module '*.jpg' {
  const img: string;
  export default img;
}

/**
 * jpegs can be imported as:
 *
 * `import MyImg from './MyImg.jpeg';`
 */
declare module '*.jpeg' {
  const img: string;
  export default img;
}
