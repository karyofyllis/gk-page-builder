import React from 'react'
import { Box, IconButton } from '@material-ui/core'
import BlockControls from '../core/BlockControls'
import { AddCircleOutline, RemoveCircleOutline } from '@material-ui/icons'
import { useAnchor } from '../hooks'

function Spacer(props) {
  const { isEditing, id, properties, handleUpdateComponentProp } = props

  const { handleClick, handleClickAway, anchorEl } = useAnchor()

  const padding = properties?.padding || 0

  const handleChange = (newValue) => {
    handleUpdateComponentProp(id, 'padding', padding + newValue)
  }

  const propertyOptions = [
    {
      custom: (
        <IconButton onClick={() => handleChange(1)}>
          <AddCircleOutline />
        </IconButton>
      )
    },
    {
      custom: (
        <IconButton disabled={padding === 1} onClick={() => handleChange(-1)}>
          <RemoveCircleOutline />
        </IconButton>
      )
    }
  ]

  return (
    <BlockControls
      onClickAway={handleClickAway}
      anchorEl={anchorEl}
      propertyOptions={propertyOptions}
      {...props}
    >
      <Box
        onClick={handleClick}
        p={padding}
        style={{ border: isEditing ? '1px solid' : 'none' }}
      />
    </BlockControls>
  )
}

export default Spacer
