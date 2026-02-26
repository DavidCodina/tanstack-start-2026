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

export const Route = createFileRoute('/api/tq-todos/$id')({
  server: {
    handlers: {
      /* ======================
      
      ====================== */

      GET: async (ctx) => {
        const { params } = ctx
        const { id } = params

        try {
          const todoIndex = todos.findIndex((todo) => todo.id === id)

          if (todoIndex === -1) {
            return Response.json(
              {
                code: codes.NOT_FOUND,
                data: null,
                message: `The todo with id ${id} was not found.`,
                success: false
              },
              { status: 404 }
            )
          }

          const todo = todos[todoIndex]

          return Response.json(
            {
              code: codes.OK,
              data: todo,
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
      
      ====================== */

      PATCH: async (ctx) => {
        const { params, request } = ctx
        const { id } = params

        try {
          const todoIndex = todos.findIndex((todo) => todo.id === id)

          if (todoIndex === -1) {
            return Response.json(
              {
                code: codes.NOT_FOUND,
                data: null,
                message: `The todo with id ${id} was not found.`,
                success: false
              },
              { status: 404 }
            )
          }

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

          // We have to be a bit more explicit with the typings here
          // because of @total-typescript/ts-reset.
          const { name } = body as Record<string, unknown>

          // Validate new values here...
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

          const todo = todos[todoIndex]
          todo.name = name

          return Response.json(
            {
              code: codes.UPDATED,
              data: todo,
              message: `Todo with id ${id} updated successfully`,
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
      
      ====================== */
      ///////////////////////////////////////////////////////////////////////////
      //
      // The basic idea is as follows:
      //
      //   DELETE: async (ctx) => {
      //     const { params, request } = ctx
      //     await sleep(100)
      //     return Response.json(
      //       { code: codes.OK, data: { params: params }, message: `Request method: ${request.method}`, success: true },
      //       { status: 200 }
      //     )
      //   }
      //
      ///////////////////////////////////////////////////////////////////////////

      DELETE: async (ctx) => {
        const { params } = ctx
        const { id } = params

        try {
          const todoIndex = todos.findIndex((todo) => todo.id === id)

          if (todoIndex === -1) {
            return Response.json(
              {
                code: codes.NOT_FOUND,
                data: null,
                message: `The todo with id ${id} was not found.`,
                success: false
              },
              { status: 404 }
            )
          }

          /* const _deletedTodo = */ todos.splice(todoIndex, 1)

          return Response.json(
            {
              code: codes.DELETED,
              data: null,
              message: `Todo with id ${id} deleted successfully`,
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
      }
    } // End of handlers
  }
})
