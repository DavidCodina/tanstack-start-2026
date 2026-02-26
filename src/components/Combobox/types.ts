///////////////////////////////////////////////////////////////////////////
//
// The StrictItem type requires the label property. This is enforced,
// so that the Base UI Combobox will automatically convert the object
// to an array of associated value strings.
//
//   ["python", "typescript"]
//
// See documentation on Combobox.Root itemToStringValue for more info.
// In the absence of the object satisfying { value, label }, Base UI
// will convert ProgrammingLanguage[] to
//
//   ['{"id":"py","value":"Python"}', '{"id":"ts","value":"TypeScript"}']
//
// This is definitely not what we want. StrictItem is used in the ComboboxItem
// itemMappingCallback, and in in the ComboboxRoot items prop.
//
// Obviously, types are not enforced at runtime. Moreover, throwing errors with
// type guards is a bad idea. Ultimately, it's up to the developer to remember
// to always have a label property on their data objects. Otherwise, you'll run
// into this weird gotcha.
//
///////////////////////////////////////////////////////////////////////////

/** The value of a single item object. */
export type StrictItem = {
  /** If no id is passed, the key falls back to index. */
  id?: string | number
  /** label is required so Base UI automatically converts { label, value }
   * objects to an array of values, when passed to the form. */
  label: string
  value: string
  /** Not used by ComboboxItem, but may be used for filtering elsewhere. */
  meta?: Record<string, unknown>
}
