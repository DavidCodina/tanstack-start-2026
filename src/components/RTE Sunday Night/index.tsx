/* eslint-disable import/order */

'use client'

//! The files in this component still has references to window and document
//! that need to be refactored for Next.js. The 'use client' directive is
//! insufficient because client components still run on the server!

import './index.css'
import { useRef, useState } from 'react'
import type { MutableRefObject } from 'react'

import {
  // $createTextNode,
  // $getSelection
  $getRoot
} from 'lexical'

import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'

// The latest version of the Lexical playground example creates a ui/ContentEditable.tsx file
// with this package and imports that instead.
import { ContentEditable } from '@lexical/react/LexicalContentEditable'

import { $generateHtmlFromNodes } from '@lexical/html'
// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

/* ======================
        Plugins
====================== */

/////////////////////////
//
// Bold:             ⌘B
// Italic:           ⌘I
// Underline:        ⌘U
// Insert/Edit Link: ⌘K
// Undo:             ⌘Z
// Redo:             ⌘⇧Z
//
/////////////////////////
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
// Provides undo/redo functionality.
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'

import { ListPlugin } from '@lexical/react/LexicalListPlugin'

// Just like the name implies. Drop 'https://www.google.com/' in your editor and click on it to go there.
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin'

import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'

// This plugin creates the draggable icon on the left side of the editor for each block.
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin'
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin'

/* ======================
      Custom Plugins
====================== */
// See here for more ideas on custom plugins:
// https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/Editor.tsx

import CustomParagraphPlugin from './plugins/CustomParagraphPlugin' // eslint-disable-line
import CustomHeadingPlugin from './plugins/CustomHeadingPlugin' // eslint-disable-line
import DragDropPaste from './plugins/DragDropPastePlugin'

import { ToolbarPlugin } from './plugins/ToolbarPlugin'
import { InitialValuePlugin } from './plugins/InitialValuePlugin'
import ImagesPlugin from './plugins/ImagesPlugin'
import InlineImagePlugin from './plugins/InlineImagePlugin'

//# See also CodeHighlightShikiPlugin:
//# https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/CodeHighlightShikiPlugin/index.ts
// This plugin allows code blocks to have different syntax highlighting.
// It works in conjunction with the code highlight theme styles and
// the language selection feature in the toolbar.
import CodeHighlightPrismPlugin from './plugins/CodeHighlightPrismPlugin'

// FloatingLinkEditorPlugin is a crucial piece in getting links to work.
// When a piece of text is selected and transformed into a linke, we need
// this plugin in order to set the associated URL.
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin'

// It seems like this plugin is partially responsible for allowing a user to select text,
// then turn it into a link. Without it, the insertLink function in ToolbarPlugin  and
// FloatingTextFormatToolbarPlugin won't work.
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
// This plugin allows us to drop a URL direclty into the editor and have it
// immediately transform into a link with that URL: 'https://www.google.com/'
import AutoLinkPlugin from './plugins/AutoLinkPlugin'

// This plugin creates a floating menu for basic formatting features when the user
// selects (i.e., highlights) a portion of text.
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin'
import ActionsPlugin from './plugins/ActionsPlugin'

// :smile will bring up a list of emojis that match the keyword "smile."
// See utils/emoji-list.ts for the complete list of emojis.
import EmojiPickerPlugin from './plugins/EmojiPickerPlugin'

// The plugin allows the user to use a limited set of emoji shorthands.
// See emojis map in EmojisPlugin.tsx for the complete list of emojis.
import EmojisPlugin from './plugins/EmojisPlugin'

import YouTubePlugin from './plugins/YouTubePlugin'

// This plugin allows us to drop a Youtube URL directly into the editor.
// A popup will then appear asking if we want to embed the video. If not
// the URL will otherwise be transformed into a link because of the AutoLinkPlugin.
// The playground demo also supported Figma and Twitter embeds, but I removed that
// logic for now.

// For YouTubePlugin
import AutoEmbedPlugin from './plugins/AutoEmbedPlugin'

// import { SquarePlugin } from './plugins/SquarePlugin'

// Previously, there was no way to hr property for theming the lexical HorizontalRulePlugin.
// Consequently, I previously used the custom HorizontalRulePlugin and HorizontalRuleNode.
// However, they have since updated that plugin, so the custom one is no longer needed.
// import { HorizontalRulePlugin } from './plugins/HorizontalRulePlugin'

/* ======================
        Nodes
====================== */

import {
  // $createHeadingNode,
  HeadingNode,
  QuoteNode
} from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'

import { CodeHighlightNode, CodeNode } from '@lexical/code-core'

import { AutoLinkNode, LinkNode } from '@lexical/link'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'

/* ======================
      Custom Nodes
====================== */

//` import { CustomParagraphNode } from './nodes/CustomParagraphNode'
//` import { CustomHeadingNode } from './nodes/CustomHeadingNode'

import { ImageNode } from './nodes/ImageNode'
import { InlineImageNode } from './nodes/InlineImageNode'
import { EmojiNode } from './nodes/EmojiNode'
import { YouTubeNode } from './nodes/YouTubeNode'
// import { SquareNode } from './nodes/SquareNode'
// import { HorizontalRuleNode } from './nodes/HorizontalRuleNode'

/* ======================
htmlConfig, theme , ui, types, etc
====================== */

import { htmlConfig } from './htmlConfig'

//# Todo: By default, Tailwind strips h1 - h6 of any styles.
//# Consequently, we need to go in and update editor-theme-h1 through editor-theme-h6
import { theme } from './theme'
import { Placeholder } from './ui/Placeholder'
import useAPI from './hooks/useAPI'

import { ToolbarContext } from './context/ToolbarContext'

/* ======================
        types
====================== */

import type {
  // EditorState,
  // LexicalEditor,
  SerializedEditorState,
  SerializedLexicalNode
  // TextNode,
} from 'lexical'

import type { InitialConfigType } from '@lexical/react/LexicalComposer'

type Values = {
  html: string
  json: SerializedEditorState<SerializedLexicalNode>
  text: string
}

type Props = {
  apiRef?: MutableRefObject<unknown>
  className?: string
  /** The initial value of the editor. This can be set immediately or asynchronously, but
   * DO NOT update it on every change! RTE should not be treated as controlled component.
   * Doing so can result in infinite loops and other unexpected behavior.
   */
  initialValue?: string
  onChange?: (values: Values) => void
  style?: React.CSSProperties
  namespace?: string
  placeholder?: string
}

type OnChange = React.ComponentProps<typeof OnChangePlugin>['onChange']

/* ========================================================================
                         
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Lexical and Slate seem very similar. That said, Slate seems to expose more
// control over the logic and put that responsibility onto the developer.
//
// Resources:
//
//   Docs:                      https://lexical.dev/
//   ✅ Video 1:                https://www.youtube.com/watch?v=qIqxvk2qcmo
//   ✅ Video 2:                https://www.youtube.com/watch?v=pIBUFYd9zJY
//   ✅ Video 3:                https://www.youtube.com/watch?v=5sRh_WXw0WI
//   ✅ Video 4:                https://www.youtube.com/watch?v=abZNazybzvs
//
//   Lexical Playground:        https://playground.lexical.dev/
//   Lexical Playground Source: https://github.com/facebook/lexical/tree/main/packages/lexical-playground
//   Releases:                  https://github.com/facebook/lexical/releases
//   Changellog:                https://github.com/facebook/lexical/blob/main/CHANGELOG.md
//
//   ✅ Usman Abdur Rehman:     https://www.youtube.com/watch?v=XI6nufqMSek&t=76s
//                              This one is okay, but he uses different abstractions than the ones in the playground example.
//
//  ✅ Usman Abdur Rehman:      https://www.youtube.com/watch?v=z8AJAXOUTzc
//
//  ✅ Easy Devv:               https://www.youtube.com/watch?v=TzkIiVv6Gh4&list=PL1kmGxeJ7el20LOlIgGoboRmlj3oBKlyN&index=1
//                             I watched some of this, but it wasn't very helpful..

// ✅  Daily Web Coding (Meh...): https://www.youtube.com/watch?v=aXAQ_ZVFI5Q
//
// ✅ theterminalguy (Meh...): https://www.youtube.com/watch?v=hJrnIrsZcEs&t=2s
//
// ❓ https://javascript.plainenglish.io/getting-started-with-lexical-2c8b94c9bdd9
// ❓ https://blog.logrocket.com/build-rich-text-editor-lexical-react/
// ❓ https://www.youtube.com/watch?v=EwoS0dIx_OI&t=11s
// ❓ https://www.youtube.com/watch?v=hJrnIrsZcEs
//
// More official examples: https://codesandbox.io/u/trueadm
// Changelog:              https://github.com/facebook/lexical/blob/main/CHANGELOG.md
//
// I'm not sure where the fonts are from. It look like they may have been grabbed
// from https://icons.getbootstrap.com/ . When you look at the associated class
// attribute for an given svg in public/images/icons, you'll see that it's the
// same naming convention as bootstrap icons. That said, some of the icons  (e.g., h4)
// look different. This may be because Bootstrap has since updated their designs.
//
///////////////////////////////////////////////////////////////////////////

export const RTE = ({
  apiRef,
  className = '',
  initialValue,
  onChange: onChangeExternal,
  namespace = 'MyEditor', // ???
  placeholder = '',
  style = {}
}: Props) => {
  const contentEditableRef = useRef<HTMLDivElement | null>(null)
  useAPI({ apiRef, contentEditableRef })

  /* ======================
        initialConfig
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // initialConfig is now defined inside the component. This way we can
  // pass namespace to it. This does not seem to need memoization.
  //
  //   export type InitialConfigType = Readonly<{
  //     namespace: string;
  //     nodes?: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>;
  //     onError: (error: Error, editor: LexicalEditor) => void;
  //     editable?: boolean;
  //     theme?: EditorThemeClasses;
  //     editorState?: InitialEditorStateType;
  //     html?: HTMLConfig;
  //   }>;
  //
  ///////////////////////////////////////////////////////////////////////////

  const initialConfig: InitialConfigType = {
    // The namespace is used internally by Lexical to manage and isolate
    // the state of different editor instances. This ensures that actions
    // and updates in one editor don't interfere with others.
    namespace: namespace,
    theme: theme,

    // Registering an error handler is required.
    // Catch any errors that occur during Lexical updates and log them
    // or throw them as needed. If you don't throw them, Lexical will
    // try to recover gracefully without losing user data.
    onError: (error, _editor) => {
      console.error(error)
    },
    // Register additional nodes
    // https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/nodes/PlaygroundNodes.ts
    nodes: [
      // This kind of transform is applied when the node is created or loaded, not on every update.
      // {
      //   replace: TextNode,
      //   with: (node: TextNode) => {
      //     console.log('TextNode:', node)
      //     // Transform logic here
      //     // For example, converting certain text to uppercase
      //     if (node.getTextContent().startsWith('Hello')) {
      //       node.setTextContent(node.getTextContent().toUpperCase())
      //     }
      //     return node
      //   }
      // },
      //` CustomParagraphNode,
      //` CustomHeadingNode,
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,

      // Unfortunately, the CodeNode exports a <pre> tag instead of <code>.
      // Also, it does not expose data-gutter on the output HTML string.
      // These issues are now fixed by the custom htmlConfig.
      CodeNode,

      CodeHighlightNode,
      HorizontalRuleNode,
      ImageNode,
      InlineImageNode,
      LinkNode,
      AutoLinkNode,
      EmojiNode,
      YouTubeNode
      // SquareNode
    ],
    // The html property in Lexical's initial configuration is used to customize how Lexical
    // nodes are exported to HTML. This is particularly useful when you want to control the
    // HTML structure and attributes of specific node types when the editor content is converted to HTML.
    html: htmlConfig
  }

  /* ======================
        state & refs
  ====================== */

  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false)

  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  /* ======================
          onRef()
  ====================== */

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  /* ======================
        onChange()
  ====================== */

  const onChange: OnChange = (editorState, editor, _tags) => {
    ///////////////////////////////////////////////////////////////////////////
    //
    // Call toJSON on the EditorState object, which produces a serialization safe string
    // const editorStateJSON = editorState.toJSON() // Only returns root
    // However, we still have a JavaScript object, so we need to convert it to an actual string with JSON.stringify
    // const stringifiedEditorState = JSON.stringify(editorStateJSON)
    // Now if we wanted we could send to server...
    //
    ///////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////
    //
    // Why do we need to perform logic within read()?
    // If you try to access selection directly inside of the onChange() handler
    // You'll get an error:
    //
    //   Unable to find an active editor state. State helpers or node methods
    //   can only be used synchronously during the callback of editor.update()
    //   or editorState.read().
    //
    // In this case, we need to use the latter because $generateHtmlFromNodes()
    // does not work in the read-only: editorState.read(() => {})
    //
    ///////////////////////////////////////////////////////////////////////////

    try {
      ///////////////////////////////////////////////////////////////////////////
      //
      // We can also use editor.update(), or just not use a wrapper method at all.
      // However, editorState.read() is used for safety.
      //
      // editor.update(() => {
      //   const root = $getRoot()
      //   // const selection = $getSelection()
      //   // https://lexical.dev/docs/concepts/serialization
      //   const html = $generateHtmlFromNodes(editor /*, selection */)
      //   const json = editorState.toJSON()
      //   const text = root.getTextContent()
      //   onChangeExternal?.({ html, json, text })
      // })
      //
      ///////////////////////////////////////////////////////////////////////////

      editorState.read(() => {
        const root = $getRoot()
        // const selection = $getSelection()
        // https://lexical.dev/docs/concepts/serialization
        const html = $generateHtmlFromNodes(editor /*, selection */)
        const json = editorState.toJSON()
        const text = root.getTextContent()
        onChangeExternal?.({ html, json, text })
      })
    } catch (err) {
      console.error('Error during onChange:', err)
    }
  }

  // https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/Editor.tsx
  return (
    <ToolbarContext>
      <LexicalComposer
        // LexicalComposer is essentially the Context wrapper that subsequently allows other
        // components to access the Context through using useLexicalComposerContext().
        initialConfig={initialConfig}
      >
        <div
          className={`rte-editor-shell ${className ? ` ${className}` : ''}`}
          style={style}
        >
          <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />

          {/* <SquarePlugin /> */}

          <div className='rte-editor-container'>
            <InitialValuePlugin initialValue={initialValue} />

            {/* <CustomParagraphPlugin /> */}

            {/* <CustomHeadingPlugin /> */}

            <DragDropPaste />

            <RichTextPlugin
              contentEditable={
                <div className='rte-editor-scroller'>
                  <div
                    className='rte-editor'
                    ref={onRef} //# Not really sure if we need this.
                  >
                    <ContentEditable
                      aria-placeholder={placeholder}
                      // The className specified here is used in ImagesPlugin & InlineImagePlugin:
                      // target.parentElement.closest('div.rte-content-editable-root')
                      // At present there is no actual CSS styles associated with this className.
                      className={'rte-content-editable-root'}
                      ref={contentEditableRef}
                      style={{
                        height: '100%',
                        // The 25px is to make space for the DraggableBlockPlugin.
                        padding: '10px 10px 10px 25px',
                        //# Ultimately, we probably want some sort of :focus-within on the top-level element.
                        outline: 'none'
                      }}
                      // Can probably take any props that a JSX <div> can take.
                      spellCheck={false}
                      placeholder={
                        <Placeholder style={{}}>{placeholder}</Placeholder>
                      }
                    />
                  </div>
                </div>
              }
              // Previously, I was putting placeholder here, but newer Lexical examples pass it
              // into the ContentEditable component. From what I've seen, either approach works.
              // ❌ placeholder={<Placeholder style={{}}>{placeholder}</Placeholder>}
              ErrorBoundary={LexicalErrorBoundary}
            />

            {/* Adds support for history stack management and undo / redo commands.*/}
            <HistoryPlugin />
            <OnChangePlugin onChange={onChange} />

            <ListPlugin />
            <CheckListPlugin />

            <ImagesPlugin />
            <InlineImagePlugin />

            <AutoEmbedPlugin />
            <YouTubePlugin />

            <HorizontalRulePlugin />
            <CodeHighlightPrismPlugin />

            {/* Here it's important that AutoLinkPlugin precedes LinkPlugin. Why?
            If LinkPlugin comes first, then if you drop 'https://www.google.com/'
            in the editor then click the trash icon in the FloatingLinkEditorPlugin
            then it won't work. */}
            <AutoLinkPlugin />

            <LinkPlugin />

            <FloatingTextFormatToolbarPlugin
              setIsLinkEditMode={setIsLinkEditMode}
            />

            {/* 
            Command + A then Command + ENTER works with or without it this.
            This plugin merely enables the CLEAR_EDITOR_COMMAND. Without out it,
            this kind of code won't work:

            import { CLEAR_EDITOR_COMMAND } from 'lexical'
            ...
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined)

            <ClearEditorPlugin /> is needed to enable the above command within
            the ActionsPlugin.
            */}
            <ClearEditorPlugin />
            <ActionsPlugin />

            <ClickableLinkPlugin />
            <TabIndentationPlugin />

            {/* I don't actually think we want this: <EmojisPlugin /> */}

            <EmojisPlugin />
            <EmojiPickerPlugin />

            {floatingAnchorElem ? (
              <>
                <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                <FloatingLinkEditorPlugin
                  // Type 'HTMLDivElement | null' is not assignable to type 'HTMLElement | undefined'.
                  // The expected type comes from property 'anchorElem' which is declared here on type
                  // 'IntrinsicAttributes & { anchorElem?: HTMLElement | undefined; isLinkEditMode: boolean;
                  // setIsLinkEditMode: Dispatch<boolean>; }'
                  anchorElem={floatingAnchorElem}
                  isLinkEditMode={isLinkEditMode}
                  setIsLinkEditMode={setIsLinkEditMode}
                />
              </>
            ) : (
              ''
            )}
          </div>
        </div>
      </LexicalComposer>
    </ToolbarContext>
  )
}
