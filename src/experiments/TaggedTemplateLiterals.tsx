/* ========================================================================

======================================================================== */

// interface TemplateStringsArray extends ReadonlyArray<string> {
//   readonly raw: readonly string[];
// }

// function tag(strings: TemplateStringsArray, ...values: any[]): string {
//   console.log(strings.raw) // ['Hello ', '. I have a question: ', '']
//   console.log(values) // ['David', 'Do you know TypeScript']
//   return `${strings[0]}${values[0]}${strings[1]}`
// }

// const name = 'David'
// const question = 'Do you know TypeScript'
// const result = tag`Hello ${name}. I have a question: ${question}`
// console.log(result) // "Hello beautiful world!"

type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type Day =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
type Year = number
type Mode = 'dashes' | 'slashes'
type Options = { mode?: Mode }
function date(
  strings: TemplateStringsArray,
  ...values: [Month, Day, Year, Options?]
): string {
  const [month, day, year, options = {}] = values

  if (
    typeof month !== 'number' ||
    typeof day !== 'number' ||
    typeof year !== 'number'
  ) {
    return `${strings[0]}???`
  }

  const separator = options?.mode === 'dashes' ? '-' : '/'

  // In many ways, tagged template literals seem like more trouble than they're worth.
  // The problem I have with them is that their usage is not as intuitive as a normal function.
  // On the other hand, they are kind of like smart strings, so you can pack a lot of logic into them.
  return `${strings[0]}${month < 10 ? `0${month}` : month}${separator}${day < 10 ? `0${day}` : day}${separator}${year}${strings[1]}`
}

const month = 5
const day = 9
const year = 1978
const options: Options = { mode: 'slashes' }

const formattedDate = date`Date: ${3}${16}${1980}${options}`
const birthdate = date`DOB: ${month}${day}${year}`

console.log({
  formattedDate,
  birthdate,
  message: `Hello my name is David. I was born on ${date`${month}${day}${year}${{ mode: 'dashes' }}`}.`
})
