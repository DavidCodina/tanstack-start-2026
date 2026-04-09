/* 
Changes made relative to lexical-playground version:

1. Made certain modifications to helper functions as noted by the comments.
2. Removed isFormatHeading() and added isHeading1(), isHeading2(), isHeading3().
*/

import { IS_APPLE } from '@lexical/utils'

///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha:
//
// On macOS, the Option key is a character composition modifier, not just a "meta" key like on Windows.
// When you hold Option and press a key, macOS intercepts the combination before the browser sees it
// and substitutes a special Unicode character — this is how Mac users type things like ©, ™, £, ¡, etc.
//
// Because isExactShortcutMatch uses event.key to check for a match, it has proven to be problematic.
// If you were going to use this in production, I would switch to a custom function that checks for
// event.code, which may prove more reliable. event.code represents the physical key position
// (Digit2, Digit3, etc.) regardless of what character the OS decides that key produces.
// It's layout/modifier-agnostic
//
// That said, event.code is based on the physical position of the key on the keyboard, mapped against a standard
// US QWERTY layout as the reference. In practice, the event.code approach can break down with letter and symbol keys,
// where various layouts diverge.
//
// In any case, the current fixes are, at least, better than the original implementation.
//
///////////////////////////////////////////////////////////////////////////
import { isExactShortcutMatch /* , isModifierMatch */ } from 'lexical'

/* ========================================================================
                                SHORTCUTS         
======================================================================== */
///////////////////////////////////////////////////////////////////////////
export const SHORTCUTS = Object.freeze({
  // (Ctrl|⌘) + (Alt|Option) + <key> shortcuts
  NORMAL: IS_APPLE ? '⌘+Opt+0' : 'Ctrl+Alt+0', // ✅ Works on Mac after fixing isFormatParagraph().
  HEADING1: IS_APPLE ? '⌘+Opt+1' : 'Ctrl+Alt+1', // ✅ Works on Mac after adding isHeading1()
  HEADING2: IS_APPLE ? '⌘+Opt+2' : 'Ctrl+Alt+2', // ✅ Works on Mac after adding isHeading2()
  HEADING3: IS_APPLE ? '⌘+Opt+3' : 'Ctrl+Alt+3', // ✅ Works on Mac after adding isHeading3()
  NUMBERED_LIST: IS_APPLE ? '⌘+Shift+7' : 'Ctrl+Shift+7', // ✅ Works on Mac
  BULLET_LIST: IS_APPLE ? '⌘+Shift+8' : 'Ctrl+Shift+8', // ✅ Works on Mac
  CHECK_LIST: IS_APPLE ? '⌘+Shift+9' : 'Ctrl+Shift+9', // ✅ Works on Mac
  CODE_BLOCK: IS_APPLE ? '⌘+Opt+C' : 'Ctrl+Alt+C', // ✅ Works on Mac
  QUOTE: IS_APPLE ? '⌃+Shift+Q' : 'Ctrl+Shift+Q', // ✅ Works on Mac
  ADD_COMMENT: IS_APPLE ? '⌘+Opt+M' : 'Ctrl+Alt+M',

  // (Ctrl|⌘) + Shift + <key> shortcuts
  INCREASE_FONT_SIZE: IS_APPLE ? '⌘+Shift+.' : 'Ctrl+Shift+.', // ✅ Works on Mac after fixing isIncreaseFontSize().
  DECREASE_FONT_SIZE: IS_APPLE ? '⌘+Shift+,' : 'Ctrl+Shift+,', // ✅ Works on Mac after fixing isDecreaseFontSize
  INSERT_CODE_BLOCK: IS_APPLE ? '⌘+Shift+C' : 'Ctrl+Shift+C', // ✅ Works on Mac
  STRIKETHROUGH: IS_APPLE ? '⌘+Shift+X' : 'Ctrl+Shift+X', // ✅ Works on Mac
  LOWERCASE: IS_APPLE ? '⌃+Shift+1' : 'Ctrl+Shift+1', // ✅ Works on Mac
  UPPERCASE: IS_APPLE ? '⌃+Shift+2' : 'Ctrl+Shift+2', // ✅ Works on Mac after fixing isUppercase().
  CAPITALIZE: IS_APPLE ? '⌃+Shift+3' : 'Ctrl+Shift+3', // ✅ Works on Mac (⚠️ Chrome, but not Firefox).
  CENTER_ALIGN: IS_APPLE ? '⌘+Shift+E' : 'Ctrl+Shift+E', // ✅ Works on Mac
  JUSTIFY_ALIGN: IS_APPLE ? '⌘+Shift+J' : 'Ctrl+Shift+J', // ✅ Works on Mac
  LEFT_ALIGN: IS_APPLE ? '⌘+Shift+L' : 'Ctrl+Shift+L', // ✅ Works on Mac
  RIGHT_ALIGN: IS_APPLE ? '⌘+Shift+R' : 'Ctrl+Shift+R', // ✅ Works on Mac

  // (Ctrl|⌘) + <key> shortcuts
  SUBSCRIPT: IS_APPLE ? '⌘+,' : 'Ctrl+,', // ✅ Works on Mac
  SUPERSCRIPT: IS_APPLE ? '⌘+.' : 'Ctrl+.', // ✅ Works on Mac
  INDENT: IS_APPLE ? '⌘+]' : 'Ctrl+]', // ✅ Works on Mac
  OUTDENT: IS_APPLE ? '⌘+[' : 'Ctrl+[', // ✅ Works on Mac
  CLEAR_FORMATTING: IS_APPLE ? '⌘+\\' : 'Ctrl+\\', // ✅ Works on Mac
  REDO: IS_APPLE ? '⌘+Shift+Z' : 'Ctrl+Y', // ✅ Works on Mac
  UNDO: IS_APPLE ? '⌘+Z' : 'Ctrl+Z', // ✅ Works on Mac
  BOLD: IS_APPLE ? '⌘+B' : 'Ctrl+B', // ✅ Works on Mac
  ITALIC: IS_APPLE ? '⌘+I' : 'Ctrl+I', // ✅ Works on Mac
  UNDERLINE: IS_APPLE ? '⌘+U' : 'Ctrl+U', // ✅ Works on Mac
  INSERT_LINK: IS_APPLE ? '⌘+K' : 'Ctrl+K' // ✅ Works on Mac
})

const CONTROL_OR_META = { ctrlKey: !IS_APPLE, metaKey: IS_APPLE }

/* ========================================================================
                          Helper Functions
======================================================================== */

export function isFormatParagraph(event: KeyboardEvent): boolean {
  // ❌ return isExactShortcutMatch(event, '0', { ...CONTROL_OR_META, altKey: true })
  // ⚠️ Added this. Mac thinks the key is 'º', lexical-playground originally coded it as "0"
  return (
    isExactShortcutMatch(event, '0', {
      ...CONTROL_OR_META,
      altKey: true
    }) || isExactShortcutMatch(event, 'º', { ...CONTROL_OR_META, altKey: true })
  )
}

// ❌ Removed this
// export function isFormatHeading(event: KeyboardEvent): boolean {
//   const { key } = event
//   return (
//     ['1', '2', '3'].includes(key) &&
//     isModifierMatch(event, { ...CONTROL_OR_META, altKey: true })
//   )
// }

// ⚠️ Added this
export function isHeading1(event: KeyboardEvent): boolean {
  return (
    isExactShortcutMatch(event, '1', {
      ...CONTROL_OR_META,
      altKey: true
    }) ||
    isExactShortcutMatch(event, '¡', {
      ...CONTROL_OR_META,
      altKey: true
    })
  )
}

// ⚠️ Added this
export function isHeading2(event: KeyboardEvent): boolean {
  return (
    isExactShortcutMatch(event, '2', {
      ...CONTROL_OR_META,
      altKey: true
    }) ||
    isExactShortcutMatch(event, '™', {
      ...CONTROL_OR_META,
      altKey: true
    })
  )
}

// ⚠️ Added this
export function isHeading3(event: KeyboardEvent): boolean {
  return (
    isExactShortcutMatch(event, '3', {
      ...CONTROL_OR_META,
      altKey: true
    }) ||
    isExactShortcutMatch(event, '£', {
      ...CONTROL_OR_META,
      altKey: true
    })
  )
}

export function isFormatNumberedList(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, '7', {
    ...CONTROL_OR_META,
    shiftKey: true
  })
}

export function isFormatBulletList(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, '8', {
    ...CONTROL_OR_META,
    shiftKey: true
  })
}

export function isFormatCheckList(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, '9', {
    ...CONTROL_OR_META,
    shiftKey: true
  })
}

export function isFormatCode(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, 'c', {
    ...CONTROL_OR_META,
    altKey: true
  })
}

export function isFormatQuote(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, 'q', {
    ctrlKey: true,
    shiftKey: true
  })
}

export function isLowercase(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, '1', { ctrlKey: true, shiftKey: true })
}

export function isUppercase(event: KeyboardEvent): boolean {
  // ❌ return isExactShortcutMatch(event, '2', { ctrlKey: true, shiftKey: true })
  // ⚠️ Added this. Mac thinks the key is "@", lexical-playground originally coded it as "2"
  // It's super weird that isLowercase works fine as it is, but here we need special handling.

  return (
    isExactShortcutMatch(event, '2', { ctrlKey: true, shiftKey: true }) ||
    isExactShortcutMatch(event, '@', { ctrlKey: true, shiftKey: true })
  )
}

export function isCapitalize(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, '3', { ctrlKey: true, shiftKey: true })
}

export function isStrikeThrough(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, 'x', {
    ...CONTROL_OR_META,
    shiftKey: true
  })
}

export function isIndent(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, ']', CONTROL_OR_META)
}

export function isOutdent(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, '[', CONTROL_OR_META)
}

export function isCenterAlign(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, 'e', {
    ...CONTROL_OR_META,
    shiftKey: true
  })
}

export function isLeftAlign(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, 'l', {
    ...CONTROL_OR_META,
    shiftKey: true
  })
}

export function isRightAlign(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, 'r', {
    ...CONTROL_OR_META,
    shiftKey: true
  })
}

export function isJustifyAlign(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, 'j', {
    ...CONTROL_OR_META,
    shiftKey: true
  })
}

export function isSubscript(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, ',', CONTROL_OR_META)
}

export function isSuperscript(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, '.', CONTROL_OR_META)
}

export function isInsertCodeBlock(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, 'c', {
    ...CONTROL_OR_META,
    shiftKey: true
  })
}

export function isIncreaseFontSize(event: KeyboardEvent): boolean {
  // ❌ return isExactShortcutMatch(event, '>', { ...CONTROL_OR_META, shiftKey: true })
  // ⚠️ Added this.  Mac thinks the key is ".", lexical-playground originally coded it as ">"
  return (
    isExactShortcutMatch(event, '>', {
      ...CONTROL_OR_META,
      shiftKey: true
    }) ||
    isExactShortcutMatch(event, '.', {
      ...CONTROL_OR_META,
      shiftKey: true
    })
  )
}

export function isDecreaseFontSize(event: KeyboardEvent): boolean {
  // ❌ return isExactShortcutMatch(event, '<', { ...CONTROL_OR_META, shiftKey: true })
  // ⚠️ Added this. Mac thinks the key is ",", lexical-playground originally coded it as "<".
  return (
    isExactShortcutMatch(event, '<', {
      ...CONTROL_OR_META,
      shiftKey: true
    }) ||
    isExactShortcutMatch(event, ',', {
      ...CONTROL_OR_META,
      shiftKey: true
    })
  )
}

export function isClearFormatting(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, '\\', CONTROL_OR_META)
}

export function isInsertLink(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, 'k', CONTROL_OR_META)
}

export function isAddComment(event: KeyboardEvent): boolean {
  return isExactShortcutMatch(event, 'm', {
    ...CONTROL_OR_META,
    altKey: true
  })
}
