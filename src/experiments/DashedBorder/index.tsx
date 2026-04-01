'use client'

/* ========================================================================

======================================================================== */
// This approach results in a lot of extra JSX.
// Better to do something like this:

// https://kovart.github.io/dashed-border-generator/
// background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%23333' stroke-width='4' stroke-dasharray='16%2c 8' stroke-dashoffset='8' stroke-linecap='square'/%3e%3c/svg%3e");
// border-radius: 10px;

export const DashedBorder = () => {
  const width = 200
  const height = 100
  const strokeWidth = 2
  const offset = strokeWidth / 2

  return (
    <div
      className='bg-card mx-auto shadow'
      style={{
        position: 'relative',
        width,
        height
      }}
    >
      {/* SVG dashed border — full control over dash length & gap */}
      <svg
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        width={width}
        height={height}
      >
        <rect
          x={offset}
          y={offset}
          width={width - strokeWidth}
          height={height - strokeWidth}
          rx={4}
          fill='none'
          stroke='currentColor'
          strokeWidth={strokeWidth}
          strokeDasharray='14 6' /* dash length, gap length */
          strokeLinecap='round'
        />
      </svg>

      {/* Box content */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.4)',
          fontSize: 12,
          fontFamily: 'monospace',
          letterSpacing: '0.08em'
        }}
      >
        200 × 100
      </div>
    </div>
  )
}
