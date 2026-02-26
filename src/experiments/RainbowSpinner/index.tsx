// Third-party imports
import './index.css'

interface IRainbowSpinner {
  containerStyle?: React.CSSProperties
  style?: React.CSSProperties
}
/* ========================================================================
                                RainbowSpinner
======================================================================== */
// This is a modified version of Colte Steele's spinner.
// https://www.youtube.com/watch?v=jA4XQbD9REE
// It adds a container and changes the CSS implementation.
// Here's another one I like:
// https://codepen.io/ALMcinnis/pen/ZEJKBrp
export const RainbowSpinner = ({
  containerStyle = {},
  style = {}
}: IRainbowSpinner) => {
  return (
    <div className='rainbow-spinner-container' style={containerStyle}>
      <div className='rainbow-spinner' style={style} />
    </div>
  )
}
