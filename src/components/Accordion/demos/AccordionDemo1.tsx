import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger
} from '../.'

// Modified Derek: https://ui.aceternity.com/tools/box-shadows
const SHADOW_MIXIN = `
shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]
`

/* ========================================================================

======================================================================== */

export const AccordionDemo1 = () => {
  return (
    <AccordionRoot className={`mx-auto max-w-[600px] ${SHADOW_MIXIN}`} multiple>
      <AccordionItem>
        <AccordionHeader>
          <AccordionTrigger>What is Base UI?</AccordionTrigger>
        </AccordionHeader>

        <AccordionPanel>
          <AccordionContent>
            Base UI is a library of high-quality unstyled React components for
            design systems and web apps.
          </AccordionContent>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionHeader>
          <AccordionTrigger>How do I get started?</AccordionTrigger>
        </AccordionHeader>

        <AccordionPanel>
          <AccordionContent>
            Head to the “Quick start” guide in the docs. If you've used unstyled
            libraries before, you'll feel at home.
          </AccordionContent>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionHeader>
          <AccordionTrigger>Can I use it for my project?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          <AccordionContent>
            Of course! Base UI is free and open source.
          </AccordionContent>
        </AccordionPanel>
      </AccordionItem>
    </AccordionRoot>
  )
}
