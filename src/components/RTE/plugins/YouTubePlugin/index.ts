/* Changes made relative to lexical-playground version:

1. Imported YouTubePayload type and applied it to 
   INSERT_YOUTUBE_COMMAND and editor.registerCommand<YouTubePayload>( ... )

*/

import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $insertNodeToNearestRoot } from '@lexical/utils'
import { COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical'

import { $createYouTubeNode, YouTubeNode } from '../../nodes/YouTubeNode'
import type { JSX } from 'react'
import type { LexicalCommand } from 'lexical'
import type { YouTubePayload } from '../../nodes/YouTubeNode'

// By setting the type to LexicalCommand<YouTubePayload>, it tells TypeScript
// what the payload will be in the dispatchCommand (used within AutoEmbedPlugin).
// editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, payload)
export const INSERT_YOUTUBE_COMMAND: LexicalCommand<YouTubePayload> =
  createCommand('INSERT_YOUTUBE_COMMAND')

/* ========================================================================
                         
======================================================================== */

export default function YouTubePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([YouTubeNode])) {
      throw new Error('YouTubePlugin: YouTubeNode not registered on editor')
    }

    // ❌ return editor.registerCommand<string>(
    return editor.registerCommand<YouTubePayload>(
      INSERT_YOUTUBE_COMMAND,
      (payload) => {
        // ⚠️ Argument of type 'string' is not assignable to parameter of type '{ videoID: string; width?: number | undefined; }'.
        // In order to fix this, yo have to change the type above
        const youTubeNode = $createYouTubeNode(payload)
        $insertNodeToNearestRoot(youTubeNode)

        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}
