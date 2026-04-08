/* Changes made relative to lexical-playground version:

1. Omitted DialogActions and Button from AutoEmbedDialog.
2. Made further changes to AutoEmbedDialog JSX return.
3. Omitted Figma and Twitter logic.
4. Added custom Button component.
5. Changed YoutubeEmbedConfig -> exampleUrl
6. Changed YoutubeEmbedConfig -> icon:  <i className='rte-icon-youtube' />,
7. Added AutoEmbedMenu, AutoEmbedMenuItem and  menuRenderFn as comments.
   They were previously part of the lexical-playground legacy implementation.
*/

import { useMemo, useState } from 'react'
// import * as ReactDOM from 'react-dom'

import {
  AutoEmbedOption,
  LexicalAutoEmbedPlugin,
  URL_MATCHER
} from '@lexical/react/LexicalAutoEmbedPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import useModal from '../../hooks/useModal'
// import Button from '../../ui/Button'
// import { DialogActions } from '../../ui/Dialog'
// import { INSERT_FIGMA_COMMAND } from '../FigmaPlugin'
// import { INSERT_TWEET_COMMAND } from '../TwitterPlugin'
import { INSERT_YOUTUBE_COMMAND } from '../YouTubePlugin'

import type { JSX } from 'react'
import type { LexicalEditor } from 'lexical'
import type {
  EmbedConfig,
  EmbedMatchResult
} from '@lexical/react/LexicalAutoEmbedPlugin'
import { Button } from '@/components/Button'

interface PlaygroundEmbedConfig extends EmbedConfig {
  // Human readable name of the embedded content e.g. Tweet or Google Map.
  contentName: string

  // Icon for display.
  icon?: JSX.Element

  // An example of a matching url https://twitter.com/jack/status/20
  exampleUrl: string

  // For extra searching.
  keywords: Array<string>

  // Embed a Figma Project.
  description?: string
}

/* ========================================================================
                         
======================================================================== */

export const YoutubeEmbedConfig: PlaygroundEmbedConfig = {
  contentName: 'Youtube Video',
  exampleUrl: 'https://www.youtube.com/watch?v=abc123',

  // Icon for display.
  icon: <i className='rte-icon-youtube' />,

  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, result.id)
  },

  keywords: ['youtube', 'video'],

  // Determine if a given URL is a match and return url data.
  parseUrl: async (url: string) => {
    const match =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url)

    const id = match ? (match?.[2].length === 11 ? match[2] : null) : null

    if (id !== null) {
      return {
        id,
        url
      }
    }

    return null
  },

  type: 'youtube-video'
}

/* ========================================================================
                         
======================================================================== */

// export const TwitterEmbedConfig: PlaygroundEmbedConfig = {
//   // e.g. Tweet or Google Map.
//   contentName: 'X(Tweet)',

//   exampleUrl: 'https://x.com/jack/status/20',

//   // Icon for display.
//   icon: <i className='icon x' />,

//   // Create the Lexical embed node from the url data.
//   insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
//     editor.dispatchCommand(INSERT_TWEET_COMMAND, result.id)
//   },

//   // For extra searching.
//   keywords: ['tweet', 'twitter', 'x'],

//   // Determine if a given URL is a match and return url data.
//   parseUrl: (text: string) => {
//     const match =
//       /^https:\/\/(twitter|x)\.com\/(#!\/)?(\w+)\/status(es)*\/(\d+)/.exec(text)

//     if (match != null) {
//       return {
//         id: match[5],
//         url: match[1]
//       }
//     }

//     return null
//   },

//   type: 'tweet'
// }

/* ========================================================================
                         
======================================================================== */

// export const FigmaEmbedConfig: PlaygroundEmbedConfig = {
//   contentName: 'Figma Document',

//   exampleUrl: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',

//   icon: <i className='icon figma' />,

//   insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
//     editor.dispatchCommand(INSERT_FIGMA_COMMAND, result.id)
//   },

//   keywords: ['figma', 'figma.com', 'mock-up'],

//   // Determine if a given URL is a match and return url data.
//   parseUrl: (text: string) => {
//     const match =
//       /https:\/\/([\w.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/.exec(
//         text
//       )

//     if (match != null) {
//       return {
//         id: match[3],
//         url: match[0]
//       }
//     }

//     return null
//   },

//   type: 'figma'
// }

/* ========================================================================
                         
======================================================================== */

export const EmbedConfigs = [
  // TwitterEmbedConfig,
  YoutubeEmbedConfig
  // FigmaEmbedConfig
]

/* ========================================================================
                         
======================================================================== */

const debounce = (callback: (text: string) => void, delay: number) => {
  let timeoutId: number
  return (text: string) => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      callback(text)
    }, delay)
  }
}

/* ========================================================================
                         
======================================================================== */

export function AutoEmbedDialog({
  embedConfig,
  onClose
}: {
  embedConfig: PlaygroundEmbedConfig
  onClose: () => void
}): JSX.Element {
  const [text, setText] = useState('')
  const [editor] = useLexicalComposerContext()
  const [embedResult, setEmbedResult] = useState<EmbedMatchResult | null>(null)

  /* ======================
        validateText()
  ====================== */

  const validateText = useMemo(
    () =>
      debounce((inputText: string) => {
        const urlMatch = URL_MATCHER.exec(inputText)
        if (embedConfig !== null && inputText !== null && urlMatch !== null) {
          Promise.resolve(embedConfig.parseUrl(inputText))
            .then((parseResult) => {
              setEmbedResult(parseResult)
              return parseResult
            })
            .catch((err) => err)
        } else if (embedResult !== null) {
          setEmbedResult(null)
        }
      }, 200),
    [embedConfig, embedResult]
  )

  /* ======================
        onClick()
  ====================== */

  const onClick = () => {
    if (embedResult !== null) {
      embedConfig.insertNode(editor, embedResult)
      onClose()
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <div className='rte-form-group'>
        <input
          autoComplete='off'
          className='rte-form-control rte-form-control-sm'
          data-test-id={`${embedConfig.type}-embed-modal-url`}
          onChange={(e) => {
            const { value } = e.target
            setText(value)
            validateText(value)
          }}
          placeholder={embedConfig.exampleUrl}
          spellCheck={false}
          type='text'
          value={text}
        />
      </div>

      {/* <DialogActions> */}
      <Button
        data-test-id={`${embedConfig.type}-embed-modal-submit-btn`}
        disabled={!embedResult}
        onClick={onClick}
        size='sm'
        variant='success'
      >
        Embed
      </Button>
      {/* </DialogActions> */}
    </>
  )
}

/* ========================================================================
                         
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// By default, Lexical abstracts away the EmojiMenuItem and overall list implementation.
// That means that there will be HTML in the DOM with very generic CSS classes.
// Those classes are way too generic, so here we implement our own custom logic.
//
///////////////////////////////////////////////////////////////////////////

// function AutoEmbedMenuItem({
//   index,
//   isSelected,
//   onClick,
//   onMouseEnter,
//   option
// }: {
//   index: number
//   isSelected: boolean
//   onClick: () => void
//   onMouseEnter: () => void
//   option: AutoEmbedOption
// }) {
//   let className = 'rte-item'
//   if (isSelected) {
//     className += ' selected' //^ Not loving 'selected'.
//   }

//   /* ======================
//           return
//   ====================== */

//   return (
//     <li
//       aria-selected={isSelected}
//       className={className}
//       id={'rte-typeahead-item-' + index}
//       onClick={onClick}
//       onMouseEnter={onMouseEnter}
//       // Error: Cannot access refs during render
//       // React refs are values that are not needed for rendering. Refs should only be accessed outside of render,
//       // such as in event handlers or effects. Accessing a ref value (the `current` property) during render can
//       // cause your component not to update as expected.
//       // ❌ ref={option.setRefElement}
//       ref={(node) => {
//         option.setRefElement(node)
//       }}
//       role='option'
//       tabIndex={-1}
//     >
//       <span className='rte-text'>{option.title}</span>
//     </li>
//   )
// }

/* ========================================================================
                         
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ The AutoEmbedMenu was previously part of the AutoEmbedPlugin as can be seen here.
//
//   https://github.com/facebook/lexical/commit/3d45e64b23eb529f98a1d39ddc982f111048d033
//
// However, component was removed from the playground plugin and the menu
// UI was consolidated into the shared menu/typeahead system inside @lexical/react.
// The playground now uses the LexicalAutoEmbedPlugin and the shared LexicalMenu / menu
// infrastructure from @lexical/react instead of a playground-local AutoEmbedMenu.
//
// I've kept the old code here for reference.
//
///////////////////////////////////////////////////////////////////////////

// function AutoEmbedMenu({
//   options,
//   selectedItemIndex,
//   onOptionClick,
//   onOptionMouseEnter
// }: {
//   selectedItemIndex: number | null
//   onOptionClick: (option: AutoEmbedOption, index: number) => void
//   onOptionMouseEnter: (index: number) => void
//   options: Array<AutoEmbedOption>
// }) {
//   /* ======================
//           return
//   ====================== */

//   return (
//     <div className='rte-typeahead-popover'>
//       <ul>
//         {options.map((option: AutoEmbedOption, i: number) => {
//           return (
//             <AutoEmbedMenuItem
//               index={i}
//               isSelected={selectedItemIndex === i}
//               key={option.key}
//               onClick={() => onOptionClick(option, i)}
//               onMouseEnter={() => onOptionMouseEnter(i)}
//               option={option}
//             />
//           )
//         })}
//       </ul>
//     </div>
//   )
// }

/* ========================================================================
                         
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// The AutoEmbedPlugin in Lexical is designed to automatically embed content from URLs into the text editor.
// The AutoEmbedPlugin detects URLs in the text editor and automatically converts them into embedded content.
// This can include videos, images, tweets, and other rich media content. The plugin uses a set of predefined
// matchers to identify the type of content and then renders the appropriate embed.
//
// For example, when you drop a youtube URL: 'https://www.youtube.com/watch?v=SyeI43BeR54' in the edior,
// a modal will appear asking if you want to embed the video.
//
///////////////////////////////////////////////////////////////////////////

export default function AutoEmbedPlugin(): JSX.Element {
  const [modal, showModal] = useModal()

  /* ======================
      openEmbedModal()
  ====================== */

  const openEmbedModal = (embedConfig: PlaygroundEmbedConfig) => {
    showModal(`Embed ${embedConfig.contentName}`, (onClose) => (
      <AutoEmbedDialog embedConfig={embedConfig} onClose={onClose} />
    ))
  }

  /* ======================
      getMenuOptions()
  ====================== */

  const getMenuOptions = (
    activeEmbedConfig: PlaygroundEmbedConfig,
    embedFn: () => void,
    dismissFn: () => void
  ) => {
    return [
      new AutoEmbedOption('Dismiss', {
        onSelect: dismissFn
      }),
      new AutoEmbedOption(`Embed ${activeEmbedConfig.contentName}`, {
        onSelect: embedFn
      })
    ]
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      {modal}
      <LexicalAutoEmbedPlugin<PlaygroundEmbedConfig>
        embedConfigs={EmbedConfigs}
        onOpenEmbedModalForConfig={openEmbedModal}
        getMenuOptions={getMenuOptions}

        // menuRenderFn={(
        //   anchorElementRef,
        //   {
        //     selectedIndex,
        //     options,
        //     selectOptionAndCleanUp,
        //     setHighlightedIndex
        //   }
        // ) => {
        //   if (anchorElementRef.current === null) {
        //     return null
        //   }

        //   return ReactDOM.createPortal(
        //     <div
        //       className='rte-typeahead-popover rte-auto-embed-menu'
        //       // https://github.com/facebook/lexical/commit/3d45e64b23eb529f98a1d39ddc982f111048d033
        //       style={{
        //         // marginLeft: `${Math.max(
        //         //   parseFloat(anchorElementRef.current.style.width) - 200,
        //         //   0
        //         // )}px`,
        //         width: 200
        //       }}
        //     >
        //       <AutoEmbedMenu
        //         onOptionClick={(option: AutoEmbedOption, index: number) => {
        //           setHighlightedIndex(index)
        //           selectOptionAndCleanUp(option)
        //         }}
        //         onOptionMouseEnter={(index: number) => {
        //           setHighlightedIndex(index)
        //         }}
        //         options={options}
        //         selectedItemIndex={selectedIndex}
        //       />
        //     </div>,
        //     anchorElementRef.current
        //   )
        // }}
      />
    </>
  )
}
