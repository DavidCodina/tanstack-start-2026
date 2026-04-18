import { CircleX, Type } from 'lucide-react'
import { Dropdown, DropdownItem } from './Dropdown'
import type { JSX } from 'react'
import type { Editor } from '@tiptap/core'
import type { MenuBarState } from './menuBarState'

type FontFamilyDropdownProps = {
  disabled?: boolean
  defaultFontFamily?: string
  editor: Editor
  editorState: MenuBarState
}

const SELECTED_MIXIN = `
text-white hover:text-white focus-visible:text-white 
bg-blue-500 hover:bg-blue-500 focus-visible:bg-blue-500
border-blue-700 dark:border-blue-300
hover:border-blue-700 dark:hover:border-blue-300
focus-visible:border-blue-700 dark:focus-visible:border-blue-300
focus-visible:ring-blue-500/50 dark:focus-visible:ring-blue-500/50
shadow-xs
`

const DEFAULT_APP_FONT_FAMILY = 'Poppins'

const fontFamilyToFontName = {
  Arial: <span style={{ fontFamily: 'Arial' }}>Arial</span>,

  '"Comic Sans MS", "Comic Sans"': (
    <span style={{ fontFamily: '"Comic Sans MS", "Comic Sans"' }}>
      Comic Sans
    </span>
  ),

  Courier: <span style={{ fontFamily: 'Courier' }}>Courier</span>,

  cursive: <span style={{ fontFamily: 'cursive' }}>Cursive</span>,

  Georgia: <span style={{ fontFamily: 'Georgia' }}>Georgia</span>,

  Tahoma: <span style={{ fontFamily: 'Tahoma' }}>Tahoma</span>,

  'Times New Roman': (
    <span style={{ fontFamily: 'Times New Roman' }}>Times New Roman</span>
  ),
  Verdana: <span style={{ fontFamily: 'Verdana' }}>Verdana</span>
}

/* ========================================================================
 
======================================================================== */

export const FontFamilyDropdown = ({
  disabled = false,
  defaultFontFamily = DEFAULT_APP_FONT_FAMILY,
  editor,
  editorState
}: FontFamilyDropdownProps): JSX.Element => {
  const getCurrentFont = () => {
    // Here 'Poppins' is being displayed as the default because that
    // is, in fact, the default font used by the current application
    // at the time of writing this.

    const currentFont =
      editorState?.fontFamily || defaultFontFamily || DEFAULT_APP_FONT_FAMILY

    const fontName =
      fontFamilyToFontName[currentFont as keyof typeof fontFamilyToFontName]

    return fontName || currentFont
  }

  /* ======================
          return
  ====================== */

  return (
    <Dropdown
      disabled={disabled}
      stopCloseOnMenuClick={false}
      triggerProps={{
        'aria-label': 'font family options',
        children: getCurrentFont(),
        className: '',
        icon: <Type />,
        title: 'font family options'
      }}
    >
      <DropdownItem
        className={editorState?.isArial ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() => editor.chain().focus().setFontFamily('Arial').run()}
        title='arial'
      >
        <Type /> <span style={{ fontFamily: 'Arial' }}>Arial</span>
      </DropdownItem>

      <DropdownItem
        className={editorState?.isComicSans ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() =>
          editor
            .chain()
            .focus()
            .setFontFamily('"Comic Sans MS", "Comic Sans"')
            .run()
        }
        title='comic sans'
      >
        <Type />{' '}
        <span style={{ fontFamily: '"Comic Sans MS", "Comic Sans"' }}>
          Comic Sans
        </span>
      </DropdownItem>

      <DropdownItem
        className={editorState?.isCourier ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() => editor.chain().focus().setFontFamily('Courier').run()}
        title='courier'
      >
        <Type />
        <span style={{ fontFamily: 'Courier' }}>Courier</span>
      </DropdownItem>

      <DropdownItem
        className={editorState?.isCursive ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() => editor.chain().focus().setFontFamily('cursive').run()}
        title='cursive'
      >
        <Type /> <span style={{ fontFamily: 'cursive' }}>Cursive</span>
      </DropdownItem>

      <DropdownItem
        className={editorState?.isGeorgia ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() => editor.chain().focus().setFontFamily('Georgia').run()}
        title='georgia'
      >
        <Type /> <span style={{ fontFamily: 'Georgia' }}>Georgia</span>
      </DropdownItem>

      <DropdownItem
        className={editorState?.isTahoma ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() => editor.chain().focus().setFontFamily('Tahoma').run()}
        title='tahoma'
      >
        <Type /> <span style={{ fontFamily: 'Tahoma' }}>Tahoma</span>
      </DropdownItem>

      <DropdownItem
        className={editorState?.isTimesNewRoman ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() =>
          editor.chain().focus().setFontFamily('Times New Roman').run()
        }
        title='times new roman'
      >
        <Type />{' '}
        <span style={{ fontFamily: 'Times New Roman' }}>Times New Roman</span>
      </DropdownItem>

      <DropdownItem
        className={editorState?.isVerdana ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() => editor.chain().focus().setFontFamily('Verdana').run()}
        title='verdana'
      >
        <Type /> <span style={{ fontFamily: 'Verdana' }}>Verdana</span>
      </DropdownItem>

      <DropdownItem
        disabled={disabled}
        onClick={() => editor.chain().focus().unsetFontFamily().run()}
        title='unset font family'
      >
        <CircleX /> Unset Font
      </DropdownItem>
    </Dropdown>
  )
}
