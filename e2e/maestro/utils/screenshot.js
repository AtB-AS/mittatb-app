// env.ID interpolates to "undefined" if not set
const mode = MODE;
const hasId = ID !== 'undefined';

const outputsByMode = {
  take: hasId ? 'take_id' : 'take',
  assert: hasId ? 'assert_id' : 'assert',
};

if (!(mode in outputsByMode)) {
  throw new Error(`Unknown SCREENSHOT_MODE: "${mode}"`);
}

output.screenshot = outputsByMode[mode];
