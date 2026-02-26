import fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { TODOS_FILE, readTodos } from './utils'
import { codes, formatZodErrors, sleep } from '@/utils'

const CreateTodoSchema = z.object({
  name: z.string().min(5, 'Must be at least 5 characters.')
})

type CreateTodoInput = z.infer<typeof CreateTodoSchema>

/* ========================================================================
                              addTodo()
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://tanstack.com/start/latest/docs/framework/react/guide/server-functions#parameters--validation
// Whatever you type AddTodoInput as then becomes the typing when consuming
// For example, if we typed this here:
//
//   type AddTodoInput = { name: string }
//
// Then when consuming addTodo(), the data property would expect it.
//
//   addTodo({ data: { name: todo } })
//
// Note:As a general best practice, I think it's best for the input to
// always be an object literal
//
// Also, with Zod the input type is automatically inferred.
//
///////////////////////////////////////////////////////////////////////////

export const addTodo = createServerFn({ method: 'POST' })
  // .middleware([mockAuthMiddleware])

  ///////////////////////////////////////////////////////////////////////////
  //
  // TanStack Start uses the Standard Schema specification.
  // Zod implements this interface, so the framework can detect it.
  // The detection likely checks for:
  //
  //   - A parse() method (Zod schemas have this)
  //   - Conformance to the Standard Schema interface
  //
  // When you pass TodoSchema to .inputValidator(), TanStack Start checks if it's
  // a Standard Schema-compatible object (like a Zod schema) and handles it accordingly.
  //
  // Duck Typing with .parse(): TanStack Start doesn't specifically know about Zod.
  // When you pass TodoSchema to inputValidator, TanStack Start simply checks if the
  // validator has a .parse() method. Any object with .parse() works —Zod, Valibot, ArkType,
  // or even a custom validator.
  //
  // When a ZodError is thrown:
  //
  //   - TanStack Start catches it
  //   - It serializes the error for network transmission
  //   - Since ZodError can't be directly serialized, it extracts the issues array
  //   - It creates a new Error object with the issues array as a JSON string in the message property.
  //
  // When catching errors on the client, it's, I have a utility that is designed specifically
  // for checking for Zod errors.
  //
  //    const maybeSerializedZodErrors = getSerializedZodErrors(err)
  //
  ///////////////////////////////////////////////////////////////////////////

  // .inputValidator(
  //   // Can pass TodoSchema inline.
  //   z.object({
  //     name: z.string().min(5, 'Must be at least 5 characters.')
  //   })
  // )

  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Even though inputValidator is only being used as a pass through, it's
  // still a good practice to use it, so the consumed addTodo has
  // type safety on the data property. However, that also means that the
  // handler will now assume that data is exactly as you typed it, and
  // not warn you that data is unknown.
  //
  ///////////////////////////////////////////////////////////////////////////

  .inputValidator((input: CreateTodoInput) => input)

  ///////////////////////////////////////////////////////////////////////////
  //
  // Using Zod is the most idiomatic approach.
  // However, if you need to pass your own data as errors, then you can
  // follow the same serialization trick.
  //
  //   .inputValidator((input: AddTodoInput) => {
  //     const { name } = input
  //     if (name === 'fail validation') {
  //       const errors = { name: 'That name sucks!' }
  //       throw new Error(JSON.stringify(errors))
  //     }
  //     return input
  //   })
  //
  // Then on the client, you'll need to check accodingly.
  //
  //   if (err instanceof Error) {
  //     if (isJSON(err.message)) {
  //       const parsedValue = JSON.parse(err.message)
  //       console.log('Custom serialized errors:', parsedValue)
  //     }
  //   }
  //
  // Of course, it's best to stick to a single convention, and in this case
  // Zod is the best choice. If your team sticks to Zod, then they can always
  // confidently use just getSerializedZodErrors(err) on the client.
  //
  // It's important that there be some kind of convention for what to expect.
  // After playing around with .inputValidator() for a while, I've decided that
  // I actually don't like throwing from it at all. Instead, I prefer to
  // immediately validate from within .handler().
  //
  ///////////////////////////////////////////////////////////////////////////

  .handler(async (ctx) => {
    const { data } = ctx
    await sleep(1500)

    const validationResult = CreateTodoSchema.safeParse(data)

    if (!validationResult.success) {
      ///////////////////////////////////////////////////////////////////////////
      //
      // https://zod.dev/error-formatting
      // Zod also offers the following utilities for formatting errors:
      //
      //   const treeified = z.treeifyError(validationResult.error)
      //   const flattened = z.flattenError(validationResult.error)
      //
      // However, even these are difficult to work with.
      //
      ///////////////////////////////////////////////////////////////////////////

      const errors = formatZodErrors(validationResult.error)

      return {
        code: codes.BAD_REQUEST,
        data: null,
        errors: errors,
        message: 'The data failed validation.',
        success: false
      }
    }

    // Always use sanitized data from Zod here.
    const { name } = validationResult.data

    try {
      ///////////////////////////////////////////////////////////////////////////
      //
      // TanStack Start's middleware context types aren't always automatically
      // inferred, resulting in context being typed as never.
      // const typedContext = context as unknown as | { isAuthenticated?: boolean } | undefined
      //
      //   if (typedContext?.isAuthenticated !== true) {
      //     return {
      //       code: codes.UNAUTHORIZED,
      //       data: null,
      //       message: 'You must be authenticated to peform this action.',
      //       success: false,
      //     }
      //   }
      //
      ///////////////////////////////////////////////////////////////////////////

      const todos = await readTodos()
      const newTodo = { id: randomUUID(), name: name }

      todos.push(newTodo)
      await fs.promises.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2))
      return {
        code: codes.CREATED,
        data: newTodo,
        message: 'success',
        success: true
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Internal Server Error'

      return {
        code: codes.INTERNAL_SERVER_ERROR,
        data: null,
        message: errorMessage,
        success: false
      }
    }
  })
