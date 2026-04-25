import { randomUUID } from 'node:crypto'
import { createFileRoute } from '@tanstack/react-router'

import { todos } from './-todos'
import {
  codes,
  parseRequest
  // randomFail,
  // sleep
} from '@/utils'

/* ========================================================================

======================================================================== */
//# Add zod to all endpoints here.

export const Route = createFileRoute(`/api/tq-todos/`)({
  server: {
    handlers: {
      /* ======================
              Get Todos
      ====================== */

      GET: async () => {
        try {
          return Response.json(
            {
              code: codes.OK,
              data: todos,
              message: 'success',
              success: true
            },
            { status: 200 }
          )
        } catch (_err) {
          return Response.json(
            {
              code: codes.INTERNAL_SERVER_ERROR,
              data: null,
              message: 'fail',
              success: false
            },
            { status: 500 }
          )
        }
      },

      /* ======================
              Add Todo
      ====================== */

      POST: async ({ request }) => {
        try {
          // await sleep(1000)
          // const body = await request.json()
          const body = await parseRequest(request)

          //  The body check is a little extra, but still nice to have.
          if (!body || typeof body !== 'object') {
            return Response.json(
              {
                code: codes.BAD_REQUEST,
                data: null,
                message: 'Missing request body..',
                success: false
              },
              { status: 400 }
            )
          }

          const { name } = body as Record<string, unknown>

          if (!name || typeof name !== 'string' || name.trim() === '') {
            return Response.json(
              {
                code: codes.BAD_REQUEST,
                data: null,
                message: 'Invalid or missing `name` property.',
                success: false
              },
              { status: 400 }
            )
          }

          const newTodo = {
            id: randomUUID(),
            name
          }

          todos.push(newTodo)

          return Response.json(
            {
              code: codes.CREATED,
              data: newTodo,
              message: 'success',
              success: true
            },
            { status: 201 }
          )
        } catch (_err) {
          // if (_err instanceof Error) {
          //   console.log({ name: _err.name, message: _err.message })
          // }

          return Response.json(
            {
              code: codes.INTERNAL_SERVER_ERROR,
              data: null,
              message: 'fail',
              success: false
            },
            { status: 500 }
          )
        }
      }
    } // End of handlers
  }
})
