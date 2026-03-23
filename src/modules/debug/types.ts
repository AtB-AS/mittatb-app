export type HeaderOverride = {
  key: string;
  value: string;
};

export type DebugServerOverride = {
  match: RegExp;
  newValue: string;
  headers?: HeaderOverride[];
};
