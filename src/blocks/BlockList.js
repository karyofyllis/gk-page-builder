import { Box, IconButton, Input, Tooltip, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import BlockControls from '../core/BlockControls'
import { useAnchor } from '../hooks'
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  TextRotateUp,
  TextRotationDown
} from '@material-ui/icons'
import { ColorPicker } from 'material-ui-color'

const BlockList = (props) => {
  const { isEditing, id, properties, handleUpdateComponentProp } = props

  const { handleClick, handleClickAway, anchorEl } = useAnchor()

  const items = properties?.items || []
  const fontWeight = properties?.fontWeight || 'normal'
  const textDecoration = properties?.textDecoration || 'none'
  const fontStyle = properties?.fontStyle || 'initial'
  const fontSize = properties?.fontSize || 16
  const color = properties?.color || 'black'
  const [currentIndex, setCurrentIndex] = useState(0)

  const minWith = '250px'

  const handleChange = (index) => (e) => {
    const newValue = e.target.value
    const listItems = items.map((item, i) => {
      if (index === i) {
        return newValue
      }
      return item
    })
    handleUpdateComponentProp(id, 'items', listItems)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleUpdateComponentProp(id, 'items', [...items, ''])
    } else if (event.keyCode === 8) {
      if (items.length > 1 && event.target.value === '') {
        handleUpdateComponentProp(id, 'items', [
          ...items.slice(0, currentIndex),
          ...items.slice(currentIndex + 1)
        ])
      }
    }
  }

  const propertyOptions = [
    {
      custom: (
        <Tooltip title='Font Weight'>
          <IconButton
            color={fontWeight === 'bold' ? 'primary' : 'default'}
            onClick={() =>
              handleUpdateComponentProp(
                id,
                'fontWeight',
                fontWeight === 'bold' ? 'normal' : 'bold'
              )
            }
          >
            <FormatBold />
          </IconButton>
        </Tooltip>
      )
    },
    {
      custom: (
        <Tooltip title='Font Style'>
          <IconButton
            color={fontStyle === 'italic' ? 'primary' : 'default'}
            onClick={() =>
              handleUpdateComponentProp(
                id,
                'fontStyle',
                fontStyle === 'italic' ? 'initial' : 'italic'
              )
            }
          >
            <FormatItalic />
          </IconButton>
        </Tooltip>
      )
    },
    {
      custom: (
        <Tooltip title='Text Decoration'>
          <IconButton
            color={textDecoration === 'underline' ? 'primary' : 'default'}
            onClick={() =>
              handleUpdateComponentProp(
                id,
                'textDecoration',
                textDecoration === 'underline' ? 'none' : 'underline'
              )
            }
          >
            <FormatUnderlined />
          </IconButton>
        </Tooltip>
      )
    },
    {
      custom: (
        <ColorPicker
          value={color}
          hideTextfield
          onChange={(e) => {
            const color = e?.css?.backgroundColor || e
            handleUpdateComponentProp(id, 'color', color)
          }}
        />
      )
    },
    {
      custom: (
        <Tooltip title='Increase Font Size'>
          <IconButton
            disabled={fontSize > 64}
            onClick={() =>
              handleUpdateComponentProp(id, 'fontSize', fontSize + 2)
            }
          >
            <TextRotateUp />
          </IconButton>
        </Tooltip>
      )
    },
    {
      custom: (
        <Tooltip title='Decrease Font Size'>
          <IconButton
            disabled={fontSize < 4}
            onClick={() =>
              handleUpdateComponentProp(id, 'fontSize', fontSize - 2)
            }
          >
            <TextRotationDown />
          </IconButton>
        </Tooltip>
      )
    }
  ]

  const styles = {
    fontWeight,
    fontSize,
    textDecoration,
    fontStyle,
    color,
    minWith
  }

  return (
    <BlockControls
      onClickAway={handleClickAway}
      anchorEl={anchorEl}
      propertyOptions={propertyOptions}
      {...props}
    >
      <Box onClick={handleClick} py={2}>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {isEditing ? (
                <Input
                  disableUnderline
                  value={item}
                  style={{ minWidth: 250, ...styles }}
                  onKeyDown={handleKeyDown}
                  fullWidth
                  onFocus={() => setCurrentIndex(index)}
                  autoFocus
                  placeholder='Enter item'
                  onChange={handleChange(index)}
                />
              ) : (
                <Typography style={styles}>{item}</Typography>
              )}
            </li>
          ))}
        </ul>
      </Box>
    </BlockControls>
  )
}

BlockList.propTypes = {}

BlockList.defaultProps = {}

export default BlockList
