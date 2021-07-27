import {
  Badge,
  Box,
  ClickAwayListener,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Popper,
  Tooltip
} from '@material-ui/core'
import {
  DeleteOutline,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreVert,
  SettingsOverscan
} from '@material-ui/icons'
import React from 'react'
import PropertyMenu from './PropertyMenu'
import QueuePlayNextIcon from '@material-ui/icons/QueuePlayNext'

const useStyles = makeStyles((theme) => ({
  paper: {
    border: '1px solid',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    backgroundColor: theme.palette.background.paper
  }
}))

const commonMenu = {
  icon: <MoreVert />,
  label: 'More',
  options: [
    {
      label: 'Remove block',
      value: 'delete',
      icon: <DeleteOutline style={{ marginRight: 8 }} />
    },
    {
      label: 'Insert Before',
      value: 'insert_before',
      icon: (
        <QueuePlayNextIcon
          style={{ marginRight: 8, transform: 'scaleX(-1)' }}
        />
      )
    },
    {
      label: 'Insert After',
      value: 'insert_after',
      icon: <QueuePlayNextIcon style={{ marginRight: 8 }} />
    }
  ]
}

const BlockControls = (props) => {
  const classes = useStyles()

  const {
    anchorEl,
    onClickAway,
    propertyOptions,
    isEditing,
    handleRemoveBlock,
    properties,
    handleUpdateComponentProp,
    handleMove,
    onRoot,
    setFromDialogOptions,
    openComponentDialog,
    list,
    id
  } = props
  const open = Boolean(anchorEl)
  const optionId = open ? `popper-${id}` : undefined

  const colSize = properties?.colSize || 'auto'

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: open && isEditing ? 'aliceblue' : 'transparent'
      }}
    >
      <ClickAwayListener onClickAway={onClickAway}>
        <div>
          {props.children}
          {isEditing && (
            <Popper
              id={optionId}
              open={open}
              anchorEl={anchorEl}
              transition
              style={{ zIndex: 1 }}
              placement='top-start'
            >
              {({ TransitionProps }) => (
                <div className={classes.paper}>
                  <Grid container alignItems='center'>
                    <Grid item>
                      <Tooltip title='Move Before'>
                        <IconButton
                          aria-haspopup='true'
                          onClick={() => handleMove(id, -1)}
                        >
                          <KeyboardArrowUp />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip title='Move After'>
                        <IconButton
                          aria-haspopup='true'
                          onClick={() => handleMove(id, 1)}
                        >
                          <KeyboardArrowDown />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    {propertyOptions[0] && (
                      <Grid item>
                        <Box mx={1}>
                          <Divider
                            style={{ height: 30 }}
                            orientation='vertical'
                          />
                        </Box>
                      </Grid>
                    )}
                    {propertyOptions.map((property, index) => (
                      <Grid key={index} item>
                        {property.custom || property.element}
                      </Grid>
                    ))}
                    {!onRoot && (
                      <Grid item>
                        <Badge badgeContent={colSize} color='primary'>
                          <PropertyMenu
                            property={columnSizeProperty}
                            value={colSize}
                            onChange={(opt) => {
                              handleUpdateComponentProp(
                                id,
                                'colSize',
                                opt.value
                              )
                              handleUpdateComponentProp(id, 'width', 'auto')
                            }}
                          />
                        </Badge>
                      </Grid>
                    )}
                    <Grid item>
                      <Box mx={1}>
                        <Divider
                          style={{ height: 30 }}
                          orientation='vertical'
                        />
                      </Box>
                    </Grid>
                    <Grid item>
                      {/* <Tooltip title='Remove Block'> */}
                      {/*  <IconButton */}
                      {/*    aria-haspopup='true' */}
                      {/*    onClick={() => handleRemoveBlock(id)} */}
                      {/*  > */}
                      {/*    <DeleteOutline /> */}
                      {/*  </IconButton> */}
                      {/* </Tooltip> */}
                      <PropertyMenu
                        property={commonMenu}
                        onChange={(opt) => {
                          switch (opt.value) {
                            case 'delete':
                              handleRemoveBlock(id)
                              break
                            case 'insert_before':
                              setFromDialogOptions({
                                id,
                                list,
                                direction: 0
                              })
                              openComponentDialog()
                              break
                            case 'insert_after':
                              setFromDialogOptions({
                                id,
                                list,
                                direction: +1
                              })
                              openComponentDialog()
                              break
                            default:
                              break
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </div>
              )}
            </Popper>
          )}
        </div>
      </ClickAwayListener>
    </div>
  )
}

BlockControls.propTypes = {}

BlockControls.defaultProps = {}

export default BlockControls

const columnSizeProperty = {
  icon: <SettingsOverscan />,
  label: 'Column Size',
  options: [
    { label: 'Auto', value: 'auto' },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
    { label: '8', value: 8 },
    { label: '9', value: 9 },
    { label: '10', value: 10 },
    { label: '11', value: 11 },
    { label: '12', value: 12 }
  ]
}
