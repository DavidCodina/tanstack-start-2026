import { useState } from 'react'
import { DropdownMenu } from './DropdownMenu'
import './index.css'

const sampleItems = [
  { id: '1', label: 'Apple', value: 'apple' },
  { id: '2', label: 'Banana', value: 'banana' },
  { id: '3', label: 'Cherry', value: 'cherry' },
  { id: '4', label: 'Date', value: 'date' },
  { id: '5', label: 'Elderberry', value: 'elderberry' },
  { id: '6', label: 'Fig', value: 'fig' },
  { id: '7', label: 'Grape', value: 'grape' },
  { id: '8', label: 'Honeydew', value: 'honeydew' },
  { id: '9', label: 'Kiwi', value: 'kiwi' },
  { id: '10', label: 'Lemon', value: 'lemon' },
  { id: '11', label: 'Mango', value: 'mango' },
  { id: '12', label: 'Orange', value: 'orange' },
  { id: '13', label: 'Papaya', value: 'papaya' },
  { id: '14', label: 'Quince', value: 'quince', disabled: true },
  { id: '15', label: 'Raspberry', value: 'raspberry' },
  { id: '16', label: 'Strawberry', value: 'strawberry' },
  { id: '17', label: 'Tangerine', value: 'tangerine' },
  { id: '18', label: 'Watermelon', value: 'watermelon' }
]

/* ========================================================================

======================================================================== */

export const FloatingUIDemo = () => {
  const [selectedFruit, setSelectedFruit] = useState<string>('')

  /* =====================
          return
  ====================== */

  return (
    <>
      <div className='mx-auto mb-6 flex max-w-[500px] flex-col items-center gap-2'>
        <DropdownMenu
          items={sampleItems}
          placeholder='Select a fruit...'
          onSelect={(item) => setSelectedFruit(item.value)}
          className='fruit-dropdown'
        />
        {selectedFruit && (
          <p className='selection-result'>
            You selected: <strong>{selectedFruit}</strong>
          </p>
        )}
      </div>

      <div className='bg-card mx-auto max-w-[500px] rounded-lg border p-4 shadow'>
        <h3 className='text-primary mb-2 text-2xl font-bold'>
          Keyboard Navigation:
        </h3>
        <ul className='list-inside list-disc space-y-2 text-sm'>
          <li>
            <kbd>Space</kbd> or <kbd>Enter</kbd> - Open/close dropdown
          </li>
          <li>
            <kbd>↑</kbd> <kbd>↓</kbd> - Navigate through options
          </li>
          <li>
            <kbd>Enter</kbd> - Select highlighted option
          </li>
          <li>
            <kbd>Escape</kbd> - Close dropdown
          </li>
          <li>
            <kbd>Tab</kbd> - Move focus away (closes dropdown)
          </li>
        </ul>
      </div>
    </>
  )
}
