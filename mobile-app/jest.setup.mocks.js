global.structuredClone = (val) => {
  return JSON.parse(JSON.stringify(val));
};

jest.mock('expo/src/winter/runtime.native', () => ({
  __ExpoImportMetaRegistry: new Map(),
}));

jest.mock('expo/src/winter/ImportMetaRegistry', () => ({
  ImportMetaRegistry: {
    get url() {
      return null;
    },
  },
}));

jest.mock('@expo/metro-runtime', () => {
  const actual = jest.requireActual('@expo/metro-runtime');
  return {
    ...actual,
  };
});

