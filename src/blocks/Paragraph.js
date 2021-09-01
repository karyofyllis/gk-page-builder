import { Box, IconButton, Input, Link, Tooltip, Typography } from "@material-ui/core";
import React, { useState } from "react";
import BlockControls from "../core/BlockControls";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  InsertLink,
  TextRotateUp,
  TextRotationDown
} from "@material-ui/icons";
import { useAnchor } from "../hooks";
import { ColorPicker } from "material-ui-color";
import InsertDialog from "../core/InsertDialog";

const Paragraph = (props) => {
  const {
    isEditing,
    handleEnter,
    id,
    properties,
    handleUpdateComponentProp,
    placeholder,
    variant,
    setActivePopperId
  } = props

  const { handleClick, handleClickAway, anchorEl } = useAnchor(
    id,
    setActivePopperId
  )

  const [openUrl, setOpenUrl] = useState(false)

  const value = properties?.text || ''
  const fontWeight = properties?.fontWeight || 'normal'
  const textDecoration = properties?.textDecoration || 'none'
  const fontStyle = properties?.fontStyle || 'initial'
  const fontSize = properties?.fontSize || 16
  const color = properties?.color || 'black'
  const url = properties?.url || ''

  const minWith = '250px'

  const handleChange = (e) => {
    const newValue = e.target.value
    handleUpdateComponentProp(id, 'text', newValue)
  }

  const handleDismissUrlDialog = (newValue) => {
    handleUpdateComponentProp(id, 'url', newValue)
    setOpenUrl(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      console.log('Enter')
      handleEnter && handleEnter()
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
    },
    {
      custom: (
        <IconButton
          color={url ? 'primary' : 'default'}
          onClick={() => setOpenUrl(true)}
        >
          <InsertLink />
        </IconButton>
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
      {isEditing ? (
        <Input
          disableUnderline
          value={value}
          onClick={handleClick}
          autoFocus
          style={{ minWidth: 250, ...styles }}
          onKeyDown={handleKeyDown}
          multiline
          fullWidth
          placeholder={placeholder}
          onChange={handleChange}
        />
      ) : (
        <Typography
          component={url ? Link : Box}
          href={url || '#'}
          target='_blank'
          variant={variant}
          style={styles}
        >
          {value}
        </Typography>
      )}
      <InsertDialog
        onClose={() => setOpenUrl(false)}
        onConfirm={handleDismissUrlDialog}
        initialValue={url}
        open={openUrl}
      />
    </BlockControls>
  )
}

Paragraph.propTypes = {}

Paragraph.defaultProps = {}

export default Paragraph
