/* 
Changes made relative to lexical-playground version:

1. Added in menuRenderFn + EmojiMenuItem. This CSS class names used here are
   defined within RTE/index.css.

*/

import { useCallback, useEffect, useMemo, useState } from 'react'
import * as ReactDOM from 'react-dom'
import { $createTextNode, $getSelection, $isRangeSelection } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch
} from '@lexical/react/LexicalTypeaheadMenuPlugin'

import type { TextNode } from 'lexical'

/* ========================================================================
                         
======================================================================== */

class EmojiOption extends MenuOption {
  title: string
  emoji: string
  keywords: Array<string>

  constructor(
    title: string,
    emoji: string,
    options: {
      keywords?: Array<string>
    }
  ) {
    super(title)
    this.title = title
    this.emoji = emoji
    this.keywords = options.keywords || []
  }
}

/* ========================================================================
                         
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// By default, Lexical abstracts away the EmojiMenuItem and overall list implementation.
// That means that there will be HTML in the DOM with the following CSS classes:
//
//   <div class='rte-typeahead-popover mentions-menu'>
//     <ul>
//       <li class='item'>
//         <span className='text'> ... </span>
//       </li>
//     </ul>
//   </div>
//
// Those classes are way too generic, so here we implement our own custom logic.
//
///////////////////////////////////////////////////////////////////////////

function EmojiMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option
}: {
  index: number
  isSelected: boolean
  onClick: () => void
  onMouseEnter: () => void
  option: EmojiOption
}) {
  let className = 'rte-item'
  if (isSelected) {
    className += ' selected' //^ Not loving 'selected'.
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={(node) => {
        option.setRefElement(node)
      }}
      role='option'
      aria-selected={isSelected}
      id={'rte-typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <span className='rte-text'>{option.title}</span>
    </li>
  )
}

/* ========================================================================
                         
======================================================================== */

type Emoji = {
  emoji: string
  description: string
  category: string
  aliases: Array<string>
  tags: Array<string>
  unicode_version: string
  ios_version: string
  skin_tones?: boolean
}

const MAX_EMOJI_SUGGESTION_COUNT = 10

export default function EmojiPickerPlugin() {
  const [editor] = useLexicalComposerContext()
  const [queryString, setQueryString] = useState<string | null>(null)
  const [emojis, setEmojis] = useState<Array<Emoji>>([])

  /* ======================

  ====================== */

  useEffect(() => {
    // @ts-ignore
    //^ This is where the emojis are defined.
    import('../../utils/emoji-list')
      .then((file) => setEmojis(file.default))
      .catch((err) => err)
  }, [])

  /* ======================

  ====================== */

  const emojiOptions = useMemo(
    () =>
      emojis !== null
        ? emojis.map(
            ({ emoji, aliases, tags }) =>
              new EmojiOption(`${emoji} ${aliases[0]}`, emoji, {
                keywords: [...aliases, ...tags]
              })
          )
        : [],
    [emojis]
  )

  /* ======================

  ====================== */

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(':', {
    minLength: 0,
    punctuation: '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\[\\]\\\\/!%\'"~=<>:;' // allow _ and -
  })

  /* ======================

  ====================== */

  const options: Array<EmojiOption> = useMemo(() => {
    return emojiOptions
      .filter((option: EmojiOption) => {
        return queryString !== null
          ? new RegExp(queryString, 'gi').exec(option.title) ||
            option.keywords !== null
            ? option.keywords.some((keyword: string) =>
                new RegExp(queryString, 'gi').exec(keyword)
              )
            : false
          : emojiOptions
      })
      .slice(0, MAX_EMOJI_SUGGESTION_COUNT)
  }, [emojiOptions, queryString])

  /* ======================

  ====================== */

  const onSelectOption = useCallback(
    (
      selectedOption: EmojiOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const selection = $getSelection()

        if (!$isRangeSelection(selection) || selectedOption === null) {
          return
        }

        if (nodeToRemove) {
          nodeToRemove.remove()
        }

        selection.insertNodes([$createTextNode(selectedOption.emoji)])

        closeMenu()
      })
    },
    [editor]
  )

  /* ======================
          return
  ====================== */

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) => {
        if (anchorElementRef.current === null || options.length === 0) {
          return null
        }

        return anchorElementRef.current && options.length
          ? ReactDOM.createPortal(
              <div className='rte-typeahead-popover rte-emoji-menu'>
                <ul>
                  {options.map((option: EmojiOption, index) => (
                    <EmojiMenuItem
                      key={option.key}
                      index={index}
                      isSelected={selectedIndex === index}
                      onClick={() => {
                        setHighlightedIndex(index)
                        selectOptionAndCleanUp(option)
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(index)
                      }}
                      option={option}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current
            )
          : null
      }}
    />
  )
}
