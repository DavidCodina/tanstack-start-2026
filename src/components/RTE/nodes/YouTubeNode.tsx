/* Changes made relative to lexical-playground version:

... 

*/

import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents'
import { DecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'
import { addClassNamesToElement } from '@lexical/utils'

import type { JSX } from 'react'
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread
} from 'lexical'

import type { SerializedDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'

type YouTubeComponentProps = Readonly<{
  className: Readonly<{
    base: string
    focus: string
  }>
  format: ElementFormatType | null
  nodeKey: NodeKey
  videoID: string
  width?: number
}>

/* ========================================================================
                         
======================================================================== */
// The logic in this file has been overhauled (e.g., importDOM, exportDOM,
// $convertYoutubeElement, etc). in order to export and import the <iframe>
// with the div wrapper for centering. Also made the iframe dynamic with
// aspect-ratio. Also added a width property. These changes also have
// affected AutoEmbedPlugin.tsx and YouTubePlugin.tsxt. Ultimately, these
// files are significantly different than the originals from the Lexical
// playground demo.

function YouTubeComponent({
  className,
  format,
  nodeKey,
  videoID,
  width //* New...
}: YouTubeComponentProps) {
  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}
    >
      <iframe
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen={true}
        frameBorder='0'
        src={`https://www.youtube-nocookie.com/embed/${videoID}`}
        //* New...
        style={{
          aspectRatio: '16 / 9',
          width: width,
          maxWidth: '100%'
        }}
        title='YouTube video'
        // ❌ height='315'
        // ❌ width='560'
      />
    </BlockWithAlignableContents>
  )
}

export type SerializedYouTubeNode = Spread<
  {
    videoID: string
    width?: number //* New...
  },
  SerializedDecoratorBlockNode
>

/* ========================================================================
                         
======================================================================== */

// ❌ Original lexical-playground version
// function $convertYoutubeElement(
//   domNode: HTMLElement
// ): null | DOMConversionOutput {
//   const videoID = domNode.getAttribute('data-lexical-youtube')
//   if (videoID) {
//     const node = $createYouTubeNode(videoID)
//     return { node }
//   }
//   return null
// }

//* New...
function $convertYoutubeElement(
  domNode: HTMLElement
): null | DOMConversionOutput {
  const iframe = domNode.querySelector('iframe')

  if (!iframe) {
    return null
  }

  const videoID = iframe.getAttribute('data-lexical-youtube')
  if (!videoID) {
    return null
  }

  const width = iframe.style.width
  const widthAsNumber = width ? parseInt(width) : width
  const numberOrUndefined =
    typeof widthAsNumber === 'number' && !isNaN(widthAsNumber)
      ? widthAsNumber
      : undefined

  const node = $createYouTubeNode({
    videoID: videoID,
    width: numberOrUndefined
  })

  // Set format based on wrapper's text-align style
  if (domNode.style.textAlign === 'center') {
    node.setFormat('center')
  } else if (domNode.style.textAlign === 'right') {
    node.setFormat('right')
  } else if (domNode.style.textAlign === 'left') {
    node.setFormat('left')
  }

  return { node }
}

/* ========================================================================
                         
======================================================================== */

export class YouTubeNode extends DecoratorBlockNode {
  __id: string
  __width?: number //* New...

  static getType(): string {
    return 'youtube'
  }

  // ❌ Original lexical-playground version
  // static clone(node: YouTubeNode): YouTubeNode {
  //   return new YouTubeNode(node.__id, node.__format, node.__key)
  // }

  //* New..
  static clone(node: YouTubeNode): YouTubeNode {
    return new YouTubeNode(node.__id, node.__width, node.__format, node.__key)
  }

  // ❌ Original lexical-playground version
  // static importJSON(serializedNode: SerializedYouTubeNode): YouTubeNode {
  //   return $createYouTubeNode(serializedNode.videoID).updateFromJSON(
  //     serializedNode
  //   )
  // }

  //* New...
  static importJSON(serializedNode: SerializedYouTubeNode): YouTubeNode {
    const node = $createYouTubeNode({
      videoID: serializedNode.videoID,
      width: serializedNode.width
    })
    node.setFormat(serializedNode.format)
    return node
  }

  // ❌ Original lexical-playground version
  // exportJSON(): SerializedYouTubeNode {
  //   return {
  //     ...super.exportJSON(),
  //     videoID: this.__id
  //   }
  // }

  //* New...
  exportJSON(): SerializedYouTubeNode {
    return {
      ...super.exportJSON(),
      type: 'youtube',
      version: 1,
      videoID: this.__id,
      width: this.__width
    }
  }

  // ❌ Original lexical-playground version
  // constructor(id: string, format?: ElementFormatType, key?: NodeKey) {
  //   super(format, key)
  //   this.__id = id
  // }

  //* New...
  constructor(
    id: string,
    // Do not set a default width here. The default width
    // is set in the YoutubeEmbedConfig in AutoEmbedPlugin.
    width?: number,
    format?: ElementFormatType,
    key?: NodeKey
  ) {
    super(format, key)
    this.__id = id
    this.__width = width
  }

  // ❌ Original lexical-playground version
  // exportDOM(): DOMExportOutput {
  //   const element = document.createElement('iframe')
  //   element.setAttribute('data-lexical-youtube', this.__id)
  //   element.setAttribute('width', '560')
  //   element.setAttribute('height', '315')
  //   element.setAttribute('src', `https://www.youtube-nocookie.com/embed/${this.__id}`)
  //   element.setAttribute('frameborder', '0')
  //   element.setAttribute(
  //     'allow',
  //     'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
  //   )
  //   element.setAttribute('allowfullscreen', 'true')
  //   element.setAttribute('title', 'YouTube video')
  //   return { element }
  // }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const theme = editor._config.theme
    const element = document.createElement('div')
    // Used for identifying the wrapper when importing with importDOM().
    element.setAttribute('data-lexical-youtube-wrapper', 'true')

    if (
      theme &&
      'embedBlock' in theme &&
      typeof theme.embedBlock !== 'undefined' &&
      'base' in theme.embedBlock
    ) {
      addClassNamesToElement(element, theme.embedBlock.base)
    }

    // What about: 'justify', 'start', 'end'
    if (this.__format === 'center') {
      element.style.textAlign = 'center'
    } else if (this.__format === 'right') {
      element.style.textAlign = 'right'
    } else if (this.__format === 'left') {
      element.style.textAlign = 'left'
    }

    const iframe = document.createElement('iframe')

    iframe.setAttribute('data-lexical-youtube', this.__id)

    iframe.style.aspectRatio = '16 / 9'

    if (this.__width !== undefined) {
      iframe.style.width = `${this.__width}px`
    }

    iframe.style.maxWidth = '100%'

    iframe.setAttribute(
      'src',
      `https://www.youtube-nocookie.com/embed/${this.__id}`
    )
    iframe.setAttribute('frameborder', '0')
    iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    )
    iframe.setAttribute('allowfullscreen', 'true')
    iframe.setAttribute('title', 'YouTube video')

    element.appendChild(iframe)
    return { element }
  }

  // ❌ Original lexical-playground version
  // static importDOM(): DOMConversionMap | null {
  //   return {
  //     iframe: (domNode: HTMLElement) => {
  //       if (!domNode.hasAttribute('data-lexical-youtube')) {
  //         return null
  //       }
  //       return {
  //         conversion: $convertYoutubeElement,
  //         priority: 1
  //       }
  //     }
  //   }
  // }

  //* New...
  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (
          domNode.hasAttribute('data-lexical-youtube-wrapper') &&
          domNode.children.length === 1 &&
          domNode.children[0] instanceof HTMLIFrameElement &&
          domNode.children[0].hasAttribute('data-lexical-youtube')
        ) {
          return {
            conversion: $convertYoutubeElement,
            ///////////////////////////////////////////////////////////////////////////
            //
            // Lexical has built-in handlers for common elements like div, which might
            // be interfering with our custom YouTube node conversion. We need to
            // increase the priority of our YouTube node conversion to ensure it
            // takes precedence over the default handlers. By increasing the priority
            // to 3 (or even higher if needed), we're telling Lexical to prefer our
            // custom conversion for divs that match our criteria over the default handlers.
            // Additionally, to ensure that our conversion is only applied to the specific
            // YouTube wrapper divs, we can make the check more strict:
            //
            // We could also use the command priorty constants from 'lexical' if we wanted
            // to be more semantic, and use best practices.
            //
            //   COMMAND_PRIORITY_CRITICAL : 4
            //   COMMAND_PRIORITY_HIGH     : 3
            //   COMMAND_PRIORITY_NORMAL   : 2
            //   COMMAND_PRIORITY_LOW      : 1
            //   COMMAND_PRIORITY_EDITOR   : 0
            //
            ///////////////////////////////////////////////////////////////////////////
            priority: 2 // was 1
          }
        }
        return null
      }
    }
  }

  updateDOM(): false {
    return false
  }

  getId(): string {
    return this.getLatest().__id
  }

  getTextContent(
    _includeInert?: boolean | undefined,
    _includeDirectionless?: false | undefined
  ): string {
    return `https://www.youtube.com/watch?v=${this.__id}`
  }

  decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
    const embedBlockTheme = config.theme.embedBlock || {}
    const className = {
      base: embedBlockTheme.base || '',
      focus: embedBlockTheme.focus || ''
    }
    return (
      <YouTubeComponent
        className={className}
        format={this.__format}
        nodeKey={this.getKey()}
        videoID={this.__id}
        width={this.__width} //* New...
      />
    )
  }
}

/* ========================================================================
                         
======================================================================== */

//* New...
// Used by YouTubePlugin.tsx
export type YouTubePayload = { videoID: string; width?: number | undefined }

// ❌ Original lexical-playground version
// export function $createYouTubeNode(videoID: string): YouTubeNode {
//   return new YouTubeNode(videoID)
// }

//* New...
export function $createYouTubeNode({
  videoID,
  width
}: YouTubePayload): YouTubeNode {
  return new YouTubeNode(videoID, width)
}

/* ========================================================================
                         
======================================================================== */

export function $isYouTubeNode(
  node: YouTubeNode | LexicalNode | null | undefined
): node is YouTubeNode {
  return node instanceof YouTubeNode
}
