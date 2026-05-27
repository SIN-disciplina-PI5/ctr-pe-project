module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|react-native|expo(nent)?|@expo(nent)?/.*|expo-router|@expo/.*|@unimodules/.*|unimodules|nativewind|react-native-css-interop|@rn-primitives/.*|@react-navigation/.*))",
  ],
  testPathIgnorePatterns: ["/node_modules/"],
};
