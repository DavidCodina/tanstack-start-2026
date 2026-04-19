import { alwaysButtonType } from './rules/alwaysButtonType.ts'

const customESLintPlugin = {
  rules: {
    'always-button-type': alwaysButtonType
  }
}

export default customESLintPlugin
