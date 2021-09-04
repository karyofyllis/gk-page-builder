import React, { useCallback, useEffect, useState } from 'react'
import {
  AddAPhoto,
  ChevronLeft,
  ChevronRight,
  DeleteOutlined,
  LinearScale,
  PhotoLibrary
} from '@material-ui/icons'
import { useAnchor } from '../../hooks'
import BlockControls from '../../core/BlockControls'
import {
  Box,
  Fab,
  IconButton,
  makeStyles,
  Tooltip,
  Typography
} from '@material-ui/core'
import Carousel from './Carousel'
import InsertDialog from '../../core/InsertDialog'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    border: '1px solid'
  },
  paperActive: {
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.primary.main}`
  },
  editable: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  iconButton: {
    margin: '0 8px'
  }
}))

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

function Editable(props) {
  const classes = useStyles()
  const { isEditing, ...rest } = props
  return isEditing ? (
    <Box className={classes.editable} {...rest}>
      {props.children}
    </Box>
  ) : null
}

const ImageView = (props) => {
  const classes = useStyles()
  const {
    id,
    setActivePopperId,
    properties,
    handleUpdateComponentProp,
    isEditing,
    onSelectMedia
  } = props

  const [openUrl, setOpenUrl] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const { handleClick, handleClickAway, anchorEl } = useAnchor(
    id,
    setActivePopperId
  )
  const images = properties?.images || []
  const imagefromLibrary = properties?.src
  const hideProgress = properties?.hideProgress || false
  const handleReposition = useCallback(
    (index, direction) => {
      const newImages = reorder(images, index, Math.abs(index + direction))
      handleUpdateComponentProp(id, 'images', newImages)
    },
    [images]
  )

  const handleRemoveImage = useCallback(
    (index) => {
      const newImages = [...images.slice(0, index), ...images.slice(index + 1)]
      handleUpdateComponentProp(id, 'images', newImages)
    },
    [images]
  )

  const handleAddOrUpdate = useCallback(
    (newValue) => {
      if (selectedImageIndex !== null) {
        const newImages = [
          ...images.slice(0, selectedImageIndex),
          newValue,
          ...images.slice(selectedImageIndex + 1)
        ]
        handleUpdateComponentProp(id, 'images', newImages)
      } else {
        handleUpdateComponentProp(id, 'images', [...images, newValue])
      }
      setSelectedImageIndex(null)
    },
    [selectedImageIndex, images]
  )

  // Add image from library to carousel
  useEffect(() => {
    if (imagefromLibrary) {
      handleAddOrUpdate(imagefromLibrary)
      handleUpdateComponentProp(id, 'src', null)
    }
  }, [imagefromLibrary])

  const handleDismissUrlDialog = (newValue) => {
    handleAddOrUpdate(newValue)
    setOpenUrl(false)
  }

  const propertyOptions = [
    {
      element: (
        <Tooltip title='Add Image from Media Library'>
          <IconButton
            onClick={() => {
              setSelectedImageIndex(null)
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
        <Tooltip title='Add Image from URL'>
          <IconButton
            onClick={() => {
              setSelectedImageIndex(null)
              setOpenUrl(true)
            }}
          >
            <AddAPhoto />
          </IconButton>
        </Tooltip>
      )
    },
    {
      custom: (
        <Tooltip title={hideProgress ? 'Show Progress' : 'Hide Progress'}>
          <IconButton
            color={hideProgress ? 'default' : 'primary'}
            onClick={() => {
              handleUpdateComponentProp(id, 'hideProgress', !hideProgress)
            }}
          >
            <LinearScale />
          </IconButton>
        </Tooltip>
      )
    }
  ]
  // handleUpdateComponentProp(id, 'src', newValue)

  function renderItem(src, index) {
    return (
      <div style={{ minHeight: 'max-content', position: 'relative' }}>
        <img
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%'
            // objectFit: 'cover'
          }}
          onClick={handleClick}
          src={src}
          alt=''
        />
        <Editable isEditing={isEditing}>
          <Tooltip title='Replace from Media Library'>
            <Fab
              variant='round'
              className={classes.iconButton}
              onClick={() => {
                setSelectedImageIndex(index)
                onSelectMedia(id)
              }}
            >
              <PhotoLibrary fontSize='large' />
            </Fab>
          </Tooltip>
          <Tooltip title='Replace Image from URL'>
            <Fab
              variant='round'
              className={classes.iconButton}
              onClick={() => {
                setSelectedImageIndex(index)
                setOpenUrl(true)
              }}
            >
              <AddAPhoto fontSize='large' />
            </Fab>
          </Tooltip>
          <Tooltip title='Move Left'>
            <Fab
              className={classes.iconButton}
              variant='round'
              onClick={() => {
                handleReposition(index, -1)
              }}
            >
              <ChevronLeft fontSize='large' />
            </Fab>
          </Tooltip>
          <Tooltip title='Move Right'>
            <Fab
              className={classes.iconButton}
              variant='round'
              onClick={() => {
                handleReposition(index, 1)
              }}
            >
              <ChevronRight fontSize='large' />
            </Fab>
          </Tooltip>
          <Tooltip title='Delete Image'>
            <Fab
              className={classes.iconButton}
              color='secondary'
              variant='round'
              onClick={() => {
                handleRemoveImage(index)
              }}
            >
              <DeleteOutlined fontSize='large' />
            </Fab>
          </Tooltip>
        </Editable>
      </div>
    )
  }

  if (images.length === 0 && !isEditing) return null

  return (
    <BlockControls
      onClickAway={handleClickAway}
      anchorEl={anchorEl}
      propertyOptions={propertyOptions}
      {...props}
    >
      <div
        onClick={handleClick}
        className={
          isEditing && (anchorEl ? classes.paperActive : classes.paper)
        }
      >
        <Carousel
          renderItem={renderItem}
          hideProgress={hideProgress}
          breakpoints={{
            xl: 1,
            lg: 1,
            md: 1,
            sm: 1,
            xs: 1
          }}
          items={images}
        />
        {images.length === 0 && (
          <Box
            display='flex'
            alignItems='center'
            flexDirection='column'
            backgroundColor='lightgray'
            justifyContent='center'
            height='100%'
            minHeight='300px'
            width='100%'
          >
            <Typography variant='h6'>Add image to carousel</Typography>
            <Box display='flex'>
              <Tooltip title='Media Library'>
                <IconButton
                  onClick={() => {
                    setSelectedImageIndex(null)
                    onSelectMedia(id)
                  }}
                >
                  <PhotoLibrary />
                </IconButton>
              </Tooltip>
              <Tooltip title='Add Image from URL'>
                <IconButton
                  onClick={() => {
                    setSelectedImageIndex(null)
                    setOpenUrl(true)
                  }}
                >
                  <AddAPhoto />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}
      </div>
      <InsertDialog
        onClose={() => setOpenUrl(false)}
        onConfirm={handleDismissUrlDialog}
        initialValue=''
        open={openUrl}
      />
    </BlockControls>
  )
}

ImageView.propTypes = {}

ImageView.defaultProps = {}

export default ImageView
