import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier/recommended'
import ts from '@vue/eslint-config-typescript'
import vuePrettier from '@vue/eslint-config-prettier'

export default [
  ...pluginVue.configs['flat/essential'], // or 'flat/recommended'
  ...ts(),
  prettier, // turns off conflicting ESLint rules
  vuePrettier, // Vue-specific Prettier adjustments
  {
    rules: {
      'prettier/prettier': 'warn',
      'vue/multi-word-component-names': 'off',
    },
  },
]
