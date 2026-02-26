import type { StrictItem } from '../../types'

export interface ProgrammingLanguage extends StrictItem {}

/* ========================================================================

======================================================================== */

export const langs: ProgrammingLanguage[] = [
  {
    id: 'js',
    value: 'javascript',
    label: 'JavaScript'
  },
  {
    id: 'ts',
    value: 'typescript',
    label: 'TypeScript'
  },
  {
    id: 'py',
    value: 'python',
    label: 'Python'
  },
  {
    id: 'java',
    value: 'java',
    label: 'Java'
  },
  {
    id: 'cpp',
    value: 'c++',
    label: 'C++'
  },
  {
    id: 'cs',
    value: 'c#',
    label: 'C#'
  },
  {
    id: 'php',
    value: 'php',
    label: 'PHP'
  },
  {
    id: 'ruby',
    value: 'ruby',
    label: 'Ruby'
  },
  {
    id: 'go',
    value: 'go',
    label: 'Go'
  },
  {
    id: 'rust',
    value: 'rust',
    label: 'Rust'
  },
  {
    id: 'swift',
    value: 'swift',
    label: 'Swift'
  }
]
