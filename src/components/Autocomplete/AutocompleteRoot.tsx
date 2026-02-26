import { Autocomplete } from '@base-ui/react/autocomplete'
// Generic type 'Props' requires 1 type argument(s).
// export type AutocompleteRootProps = Autocomplete.Root.Props
export type AutocompleteRootProps = React.ComponentProps<
  typeof Autocomplete.Root
>

/* ========================================================================

======================================================================== */
// Groups all parts of the autocomplete. Doesn't render its own HTML element.

export const AutocompleteRoot = ({
  name,
  defaultValue,
  value,
  onValueChange,
  defaultOpen,
  open,
  onOpenChange,
  autoHighlight,
  keepHighlight,
  highlightItemOnHover,
  actionsRef,
  filter,
  filteredItems,
  grid,
  inline,
  itemToStringValue,
  items,
  limit,
  locale,
  loopFocus,
  modal,
  mode,
  onItemHighlighted,
  onOpenChangeComplete,
  openOnInputClick,
  submitOnItemClick,
  virtualized,
  disabled,
  readOnly,
  required,
  inputRef,
  id,
  children,
  ...otherProps
}: AutocompleteRootProps) => {
  return (
    <Autocomplete.Root
      {...otherProps}
      // Doesn't render its own HTML element.
      // ❌ data-slot='autocomplete-root'
      name={name}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      autoHighlight={autoHighlight}
      keepHighlight={keepHighlight}
      highlightItemOnHover={highlightItemOnHover}
      actionsRef={actionsRef}
      filter={filter}
      filteredItems={filteredItems}
      grid={grid}
      inline={inline}
      itemToStringValue={itemToStringValue}
      items={items}
      limit={limit}
      locale={locale}
      loopFocus={loopFocus}
      modal={modal}
      mode={mode}
      onItemHighlighted={onItemHighlighted}
      onOpenChangeComplete={onOpenChangeComplete}
      openOnInputClick={openOnInputClick}
      submitOnItemClick={submitOnItemClick}
      virtualized={virtualized}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      inputRef={inputRef}
      id={id}
      children={children}
    />
  )
}
