import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { validateUrl } from '../../utils/url'
import type { JSX } from 'react'

type Props = {
  hasLinkAttributes?: boolean
}

/* ========================================================================

======================================================================== */
// This plugin is partially responsible for allowing a user to select text,
// then turn it into a link. For example, if you typed "Go To Google", then
// selected it, you would not be able to convert it into a link without this plugin.
// That said, its absence does not prevent you from typing in an actual URL, and
// have lexical treat it as a link.

export const LinkPlugin = ({
  hasLinkAttributes = false
}: Props): JSX.Element => {
  return (
    <LexicalLinkPlugin
      validateUrl={validateUrl}
      attributes={
        hasLinkAttributes
          ? {
              rel: 'noopener noreferrer',
              target: '_blank'
            }
          : undefined
      }
    />
  )
}
