import React, { useState } from 'react'
import { Height, ImageSearch, PhotoLibrary } from '@material-ui/icons'
import { useAnchor } from '../hooks'
import BlockControls from '../core/BlockControls'
import { IconButton, Tooltip } from '@material-ui/core'
import InsertDialog from '../core/InsertDialog'
import WidthDialog from '../core/WidthDialog'

const ImageView = (props) => {
  const { id, properties, handleUpdateComponentProp, onSelectMedia } = props

  const { handleClick, handleClickAway, anchorEl } = useAnchor()

  const [openUrl, setOpenUrl] = useState(false)
  const [openWidth, setOpenWidth] = useState(false)

  const src = properties?.src || 'https://via.placeholder.com/250'
  const url = properties?.url || ''
  const width = properties?.width || 'auto'

  const propertyOptions = [
    {
      element: (
        <Tooltip title='Media Library'>
          <IconButton
            onClick={() => {
              onSelectMedia(id)
            }}
          >
            <PhotoLibrary />
          </IconButton>
        </Tooltip>
      )
    },
    {
      custom: (
        <Tooltip title='Image URL'>
          <IconButton
            color={url ? 'primary' : 'default'}
            onClick={() => setOpenUrl(true)}
          >
            <ImageSearch />
          </IconButton>
        </Tooltip>
      )
    },
    {
      custom: (
        <Tooltip title='Set Width'>
          <IconButton
            color={width !== 'auto' ? 'primary' : 'default'}
            onClick={() => setOpenWidth(true)}
          >
            <Height style={{ transform: 'rotate(90deg)' }} />
          </IconButton>
        </Tooltip>
      )
    }
  ]

  const handleDismissUrlDialog = (newValue) => {
    handleUpdateComponentProp(id, 'src', newValue)
    setOpenUrl(false)
  }

  const handleDismissWidthDialog = (newValue) => {
    handleUpdateComponentProp(id, 'width', newValue + 'px')
    handleUpdateComponentProp(id, 'colSize', 'auto')
    setOpenWidth(false)
  }

  return (
    <BlockControls
      onClickAway={handleClickAway}
      anchorEl={anchorEl}
      propertyOptions={propertyOptions}
      {...props}
    >
      <img
        style={{ maxWidth: '100%', width }}
        onClick={handleClick}
        src={src}
        alt=''
      />
      <InsertDialog
        onClose={() => setOpenUrl(false)}
        onConfirm={handleDismissUrlDialog}
        initialValue={url}
        open={openUrl}
      />
      <WidthDialog
        onClose={() => setOpenWidth(false)}
        onConfirm={handleDismissWidthDialog}
        initialValue={width}
        open={openWidth}
      />
    </BlockControls>
  )
}

ImageView.propTypes = {}

ImageView.defaultProps = {}

export default ImageView
