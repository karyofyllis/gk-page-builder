import React, { useState } from 'react'

import {
  Card,
  CardActionArea,
  CardContent,
  ClickAwayListener,
  Grid,
  IconButton,
  List,
  ListItem,
  makeStyles,
  Popper,
  TextField,
  Typography
} from '@material-ui/core'
import { AddCircleOutline } from '@material-ui/icons'
import PropTypes from 'prop-types'
import { useEscape } from '../hooks'

const useStyles = makeStyles((theme) => ({
  paper: {
    border: '1px solid',
    padding: theme.spacing(1),
    width: 400,
    backgroundColor: theme.palette.background.paper
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60
  }
}))

const ComponentListBox = (props) => {
  const classes = useStyles()
  const { onComponentSelect } = props

  const [query, setQuery] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClickAway = () => {
    setAnchorEl(null)
  }

  const handleComponentSelect = (component) => {
    setAnchorEl(null)
    setQuery('')
    onComponentSelect(component)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'transitions-popper' : undefined

  useEscape(setAnchorEl)

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <IconButton onClick={handleClick}>
          <AddCircleOutline />
        </IconButton>
        <Popper
          id={id}
          open={open}
          anchorEl={anchorEl}
          style={{ zIndex: 1 }}
          transition
          placement='bottom-end'
        >
          {({ TransitionProps }) => (
            <div className={classes.paper}>
              <List component='nav' aria-label='main mailbox folders'>
                <ListItem>
                  <TextField
                    autoFocus
                    fullWidth
                    placeholder='Start typing...'
                    label='Block Library'
                    variant='filled'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </ListItem>
                <ListItem component={Grid} container spacing={2}>
                  {props.list
                    .filter((x) =>
                      x.name.toLowerCase().includes(query.toLowerCase())
                    )
                    .slice(0, 9)
                    .map((component) => (
                      <Grid item xs={4}>
                        <Card variant='outlined'>
                          <CardActionArea
                            onClick={() => handleComponentSelect(component)}
                          >
                            <CardContent className={classes.card}>
                              {component.icon}
                              <Typography style={{ textAlign: 'center' }}>
                                {component.name}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ))}
                </ListItem>
              </List>
            </div>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  )
}

ComponentListBox.propTypes = {
  onComponentSelect: PropTypes.func.isRequired
}

ComponentListBox.defaultProps = {}

export default ComponentListBox
