import type { Editor } from '@tiptap/core'

/* ======================

====================== */
//# Later we may also have 'check' for checklists.

export const getBlockType = (editor: Editor) => {
  if (editor.isActive('heading', { level: 1 })) return 'h1'
  if (editor.isActive('heading', { level: 2 })) return 'h2'
  if (editor.isActive('heading', { level: 3 })) return 'h3'
  if (editor.isActive('heading', { level: 4 })) return 'h4'
  if (editor.isActive('heading', { level: 5 })) return 'h5'
  if (editor.isActive('heading', { level: 6 })) return 'h6'

  if (editor.isActive('bulletList')) return 'bullet'
  if (editor.isActive('orderedList')) return 'number'
  if (editor.isActive('blockquote')) return 'quote'
  if (editor.isActive('codeBlock')) return 'code'

  return 'paragraph' // safe default — avoids the isActive('paragraph') gotcha
}

/* ======================

====================== */
// The block type keys must correspont to what is returned from getBlockType().

export const blockTypeToBlockName = {
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  bullet: 'Bulleted List',
  number: 'Numbered List',
  check: 'Check List',
  quote: 'Quote',
  code: 'Code Block',
  paragraph: 'Paragraph'
}
