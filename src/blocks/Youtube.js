import React, { useState } from 'react'
import BlockControls from '../core/BlockControls'
import { useAnchor } from '../hooks'
import InsertDialog from '../core/InsertDialog'
import { IconButton, Tooltip } from '@material-ui/core'
import YouTubeIcon from '@material-ui/icons/YouTube'
import { makeStyles } from '@material-ui/core/styles'

const styles = (theme) => ({
  root: {
    width: '100%',
    [theme.breakpoints.up('xs')]: {
      height: 280
    },
    [theme.breakpoints.up('sm')]: {
      height: 480
    },
    [theme.breakpoints.up('md')]: {
      height: 600
    },
    [theme.breakpoints.up('lg')]: {
      height: 680
    },
    [theme.breakpoints.up('xl')]: {
      height: 720
    }
  }
})

const useStyles = makeStyles(styles)

function PlainHtml(props) {
  const classes = useStyles()
  const {
    handleRemoveBlock,
    id,
    properties,
    isEditing,
    handleUpdateComponentProp
  } = props

  const [openUrl, setOpenUrl] = useState(false)

  const embedId = properties?.embedId || ''

  const { handleClick, handleClickAway, anchorEl } = useAnchor()

  const handleDismissUrlDialog = (newValue) => {
    handleUpdateComponentProp(id, 'embedId', newValue)
    setOpenUrl(false)
  }

  const propertyOptions = [
    {
      custom: (
        <Tooltip title='Youtube Embed ID'>
          <IconButton
            color={embedId ? 'primary' : 'default'}
            onClick={() => setOpenUrl(true)}
          >
            <YouTubeIcon />
          </IconButton>
        </Tooltip>
      )
    }
  ]

  return (
    <BlockControls
      onClickAway={handleClickAway}
      handleRemoveBlock={handleRemoveBlock}
      anchorEl={anchorEl}
      propertyOptions={propertyOptions}
      {...props}
    >
      <div
        onClick={handleClick}
        className='video-responsive'
        style={{
          padding: isEditing ? 8 : 0,
          border: isEditing ? '1px dashed' : 'none'
        }}
      >
        <iframe
          className={classes.root}
          src={`https://www.youtube.com/embed/${embedId}`}
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          title='Embedded youtube'
        />
      </div>

      <InsertDialog
        onClose={() => setOpenUrl(false)}
        onConfirm={handleDismissUrlDialog}
        initialValue={embedId}
        open={openUrl}
        name='Embed ID'
      />
    </BlockControls>
  )
}

export default PlainHtml
