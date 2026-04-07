import * as React from 'react'

import {
  AutoLinkPlugin,
  createLinkMatcherWithRegExp
} from '@lexical/react/LexicalAutoLinkPlugin'
import { $isCodeNode } from '@lexical/code-core' //* New...

/* ========================================================================
      
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Note: Newer versions of the lexical-playground have an AutoLinkExtension,
// rather than an AutoLinkPlugin. However, it's still located in the plugins folder.
// Here, I've simply kept the AutoLinkPlugin implementation.
//
// What does this do? It works in conjunctionw with FloatingLinkEditorPlugin. Basically,
// when you type or paste in a URL, it triggers the FloatingLinkEditorPlugin.
//
///////////////////////////////////////////////////////////////////////////

const URL_REGEX =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)(?<![-.+():%])/

const EMAIL_REGEX =
  /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/

const MATCHERS = [
  createLinkMatcherWithRegExp(URL_REGEX, (text) => {
    return text.startsWith('http') ? text : `https://${text}`
  }),
  createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => {
    return `mailto:${text}`
  })
]

export default function LexicalAutoLinkPlugin(): React.JSX.Element {
  return (
    <AutoLinkPlugin
      // DC: Added this in April 2026 to reflect the current logic that
      // is in lexical-playground's plugins/AutoLinkExtension.tsx
      excludeParents={[$isCodeNode]}
      matchers={MATCHERS}
    />
  )
}
