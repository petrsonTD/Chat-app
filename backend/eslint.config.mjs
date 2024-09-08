import globals from 'globals';
import pluginJs from '@eslint/js';


export default [
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    {
        rules: {
            'react/react-in-jsx-scope': 'off',
            'no-unused-vars': 'warn',
            'indent': [
                'warn',
                4
            ],
            'semi': [
                'warn',
                'always'
            ],
            'quotes': [
                'error',
                'single'
            ],
        }
    }
];