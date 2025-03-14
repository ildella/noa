import globals from 'globals'
import nostandard from 'eslint-nostandard'
import eslintPluginSvelte from 'eslint-plugin-svelte'
import playwright from 'eslint-plugin-playwright'

const camelcase = [
  'warn',
  {
    allow: [
      'created_at',
      'created_time',
      'display_name',
      'package_name',
      'sha256_cert_fingerprints',
    ],
  },
]

const ignores = [
  'tauri/*',
  'build/*',
  '.svelte-kit/*',
  'docs/*',
  'bin/*',
]

export default [
  {
    name: 'NOA',
    ignores,
  },
  ...nostandard(),
  ...eslintPluginSvelte.configs['flat/recommended'],
  {
    name: 'NOA Rules',
    languageOptions: {globals: globals.browser},
    rules: {
      camelcase,
      '@stylistic/js/max-len': ['warn', {
        code: 100,
        ignoreComments: false,
        ignoreRegExpLiterals: false,
        ignoreStrings: false,
        ignoreTemplateLiterals: false,
        ignoreUrls: false,
      }],
      // DOCS: more rules: https://sveltejs.github.io/eslint-plugin-svelte/rules/
      'svelte/html-closing-bracket-new-line': [
        'warn',
        {
          singleline: 'never', // ["never", "always"]
          multiline: 'always', // ["never", "always"]
          selfClosingTag: {
            singleline: 'never', // ["never", "always"]
            multiline: 'always', // ["never", "always"]
          },
        },
      ],
      'svelte/html-quotes': [
        'warn',
        {
          prefer: 'single',
          dynamic: {
            quoted: false,
            avoidInvalidUnquotedInHTML: false,
          },
        },
      ],
      'svelte/first-attribute-linebreak': [
        'warn',
        {
          multiline: 'below', // or "beside"
          singleline: 'beside', // "below"
        },
      ],
      'svelte/indent': [
        'warn',
        {
          indent: 2,
          ignoredNodes: [],
          switchCase: 1,
          alignAttributesVertically: false,
        },
      ],
      'svelte/max-attributes-per-line': [
        'warn',
        {
          multiline: 1,
          singleline: 1,
        },
      ],
      'svelte/mustache-spacing': [
        'warn',
        {
          textExpressions: 'never',
          attributesAndProps: 'never',
          directiveExpressions: 'never',
          tags: {
            openingBrace: 'never',
            closingBrace: 'never',
          },
        },
      ],
      'svelte/no-dom-manipulating': 'error',
      'svelte/no-dupe-on-directives': 'error',
      'svelte/no-spaces-around-equal-signs-in-attribute': 'warn',
      'svelte/no-inline-styles': [
        'warn',
        {allowTransitions: true},
      ],
      'svelte/no-target-blank': [
        'error',
        {
          allowReferrer: true,
          enforceDynamicLinks: 'always',
        },
      ],
    },
  },
  {
    name: 'Playwright E2E browser tests',
    files: ['tests/**/*.*js'],
    ...playwright.configs['flat/recommended'],
    rules: {'max-statements': ['warn', 20]},
  },
]
