import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": "warn",
      "react/prop-types": "off",
      "indent": [
        "warn",
        2
      ],
      "semi": [
        "warn",
        "always"
      ],
      "quotes": [
        "error",
        "double"
      ],
    }
  }
];