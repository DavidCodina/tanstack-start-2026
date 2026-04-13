import { Extension } from '@tiptap/core'
import { AllSelection, TextSelection } from 'prosemirror-state'

import type { Command } from '@tiptap/core'
import type { Transaction } from 'prosemirror-state'

export interface IndentOptions {
  types: string[]
  minLevel: number
  maxLevel: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType
      outdent: () => ReturnType
    }
  }
}

/* ========================================================================

======================================================================== */
// Based off of https://github.com/evanfuture/tiptaptop-extension-indent/blob/main/src/lib/indent.ts

export const Indent = Extension.create<IndentOptions>({
  name: 'indent',

  ///////////////////////////////////////////////////////////////////////////
  //
  // Object literal may only specify known properties, and 'defaultOptions' does not
  // exist in type 'Partial<ExtensionConfig<IndentOptions, any>> | (() => Partial<ExtensionConfig<IndentOptions, any>>)'.
  //
  //   defaultOptions: {
  //     types: ['listItem', 'paragraph'],
  //     minLevel: 0,
  //     maxLevel: 8
  //   },
  //
  ///////////////////////////////////////////////////////////////////////////
  addOptions() {
    return {
      // By default, paragraph and listItem types can have indentation applied.
      // The way the are applied is simple, it just adds a data-indent property
      // to the element in question. The styling is up to you...
      types: ['paragraph', 'listItem'],

      ///////////////////////////////////////////////////////////////////////////
      //
      // These are used to create data-indent='1', data-indent='2', etc.
      // The data-indent attribute is then used to style the indentation as
      // you see fit. This may seem strange at first. Why not just apply styles
      // directly? The data-indent approach is actually more idiomatic for Tiptap.
      // The problem arises when two extensions both write to the style attribute.
      // This way we avoid overwriting or collision risk. Moreover, it's maximally
      // flexible. Maybe later on down the line, we decide we want to change the
      // indentation values. This is easy since the actual indendation is not hardcoded.
      //
      ///////////////////////////////////////////////////////////////////////////
      minLevel: 0,
      maxLevel: 8
    }
  },

  /* =====================

  ====================== */

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            renderHTML: (attributes) => {
              return attributes?.indent > this.options.minLevel
                ? { 'data-indent': attributes.indent }
                : null
            },
            parseHTML: (element) => {
              const level = Number(element.getAttribute('data-indent'))
              return level && level > this.options.minLevel ? level : null
            }
          }
        }
      }
    ]
  },

  /* =====================

  ====================== */

  addCommands() {
    const setNodeIndentMarkup = (
      tr: Transaction,
      pos: number,
      delta: number
    ): Transaction => {
      const node = tr?.doc?.nodeAt(pos)

      if (node) {
        const nextLevel = (node.attrs.indent || 0) + delta
        const { minLevel, maxLevel } = this.options
        const indent =
          nextLevel < minLevel
            ? minLevel
            : nextLevel > maxLevel
              ? maxLevel
              : nextLevel

        if (indent !== node.attrs.indent) {
          const { indent: _oldIndent, ...currentAttrs } = node.attrs
          const nodeAttrs =
            indent > minLevel ? { ...currentAttrs, indent } : currentAttrs
          return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks)
        }
      }
      return tr
    }

    /* =================== */

    const updateIndentLevel = (tr: Transaction, delta: number): Transaction => {
      const { doc, selection } = tr

      if (
        doc &&
        selection &&
        (selection instanceof TextSelection ||
          selection instanceof AllSelection)
      ) {
        const { from, to } = selection
        doc.nodesBetween(from, to, (node, pos) => {
          // Temporarily log node names if you're unsure what they are
          // console.log('node.type.name', node.type.name)
          if (this.options.types.includes(node.type.name)) {
            tr = setNodeIndentMarkup(tr, pos, delta)
            return false
          }

          return true
        })
      }

      return tr
    }

    /* =================== */

    const applyIndent: (direction: number) => () => Command =
      (direction) =>
      () =>
      ({ tr, state, dispatch }) => {
        const { selection } = state
        tr = tr.setSelection(selection)
        tr = updateIndentLevel(tr, direction)

        if (tr.docChanged) {
          dispatch?.(tr)
          return true
        }

        return false
      }

    return {
      indent: applyIndent(1),
      outdent: applyIndent(-1)
    }
  },

  /* =====================

  ====================== */

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        return this.editor.commands.indent()
      },
      'Shift-Tab': () => {
        return this.editor.commands.outdent()
      }
    }
  }
})
