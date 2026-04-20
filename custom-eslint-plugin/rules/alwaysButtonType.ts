'use strict'

const VALID_BUTTON_TYPES = ['button', 'submit', 'reset']

export const alwaysButtonType = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Always use the type attribute on buttons.',
      category: 'Best Practices',
      recommended: false
    },
    // This tells ESLint the rule takes no options. If you wanted configuration
    // (e.g., ignoring certain patterns), you'd define a schema here.
    schema: [],
    messages: {
      missingType:
        'Always use the `type` attribute on buttons to protect against accidental form submissions.',
      invalidType:
        "Button type must be one of 'button', 'submit', or 'reset'. Got '{{value}}'."
    }
  },

  /* ========================================================================

  ======================================================================== */

  create(context: any) {
    /* =====================
          JSX: <button> 
    ====================== */
    // This guards against capitalized component names like <Button>

    function checkJSXButton(node: any) {
      // Only target lowercase <button> (native DOM element, not a component)
      if (node.name.type !== 'JSXIdentifier' || node.name.name !== 'button') {
        return
      }

      // Find a `type` JSX attribute, ignoring spread attributes ({...props})
      const typeAttr = node.attributes.find(
        (attr: any) =>
          attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'type'
      )

      // No type attribute at all → report
      if (!typeAttr) {
        context.report({ node, messageId: 'missingType' })
        return
      }

      // type attribute exists but has no value, e.g. <button type />
      if (typeAttr.value === null) {
        context.report({ node: typeAttr, messageId: 'missingType' })
        return
      }

      // type={expression} — could be a string literal or a dynamic value
      if (typeAttr.value.type === 'JSXExpressionContainer') {
        const expr = typeAttr.value.expression

        // type={"submit"} — static string inside braces, still checkable
        if (expr.type === 'Literal' && typeof expr.value === 'string') {
          if (!VALID_BUTTON_TYPES.includes(expr.value)) {
            context.report({
              node: typeAttr,
              messageId: 'invalidType',
              data: { value: expr.value }
            })
          }
        }

        // type={someVariable} or type={fn()} — dynamic, skip static analysis
        return
      }

      // type="submit" — plain string literal (most common case)
      if (typeAttr.value.type === 'Literal') {
        const val = typeAttr.value.value
        if (!VALID_BUTTON_TYPES.includes(val)) {
          context.report({
            node: typeAttr,
            messageId: 'invalidType',
            data: { value: val }
          })
        }
      }
    }

    /* =====================
    React.createElement('button', props) 
    ====================== */

    function checkCreateElement(node: any) {
      // Match React.createElement(...) or createElement(...) directly
      const callee = node.callee
      const isCreateElement =
        (callee.type === 'MemberExpression' &&
          callee.object.name === 'React' &&
          callee.property.name === 'createElement') ||
        (callee.type === 'Identifier' && callee.name === 'createElement')

      if (!isCreateElement) return

      const args = node.arguments
      if (!args.length) return

      // First argument must be the string literal 'button'
      if (args[0].type !== 'Literal' || args[0].value !== 'button') return

      const propsArg = args[1]

      // No props argument, or props is null/undefined/not an object literal
      if (!propsArg || propsArg.type !== 'ObjectExpression') {
        context.report({ node, messageId: 'missingType' })
        return
      }

      // Look for a `type` key in the props object
      const typeProp = propsArg.properties.find(
        (prop: any) =>
          prop.type === 'Property' &&
          prop.key &&
          (prop.key.name === 'type' || prop.key.value === 'type')
      )

      if (!typeProp) {
        context.report({ node, messageId: 'missingType' })
        return
      }

      // Validate the value if it's a static string
      if (
        typeProp.value.type === 'Literal' &&
        typeof typeProp.value.value === 'string'
      ) {
        const val = typeProp.value.value
        if (!VALID_BUTTON_TYPES.includes(val)) {
          context.report({
            node: typeProp,
            messageId: 'invalidType',
            data: { value: val }
          })
        }
      }

      // Dynamic value (variable, template literal, etc.) — skip
    }

    return {
      JSXOpeningElement: checkJSXButton,
      CallExpression: checkCreateElement
    }
  }
}
