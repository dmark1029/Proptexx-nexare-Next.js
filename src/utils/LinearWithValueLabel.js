import * as React from 'react'
import PropTypes from 'prop-types'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{'& .MuiLinearProgress-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',  
            }, width: '100%', mr: 1 }}>
      <LinearProgress
          variant='determinate'
          {...props}
          sx={{ 
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'black',  
            },
          }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant='body2' color="black">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  )
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
}

export default function LinearWithValueLabel(props) {
  const [progress, setProgress] = React.useState(10)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 10 : prevProgress + 10
      )
    }, 3000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={props.value} />
    </Box>
  )
}
