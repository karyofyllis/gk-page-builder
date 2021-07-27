import React, { useState } from 'react'

import {
  ClickAwayListener,
  Input,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Popper
} from '@material-ui/core'
import { componentList } from '../model'
import PropTypes from 'prop-types'
import ComponentListBoxPoper from './ComponentListBoxPoper'
import { useEscape } from '../hooks'

const useStyles = makeStyles((theme) => ({
  paper: {
    border: '1px solid',
    padding: theme.spacing(1),
    width: 250,
    overflow: 'auto',
    maxHeight: 350,
    backgroundColor: theme.palette.background.paper
  }
}))

const ComponentDirectorySearch = (props) => {
  const classes = useStyles()
  const { onComponentSelect } = props

  const [query, setQuery] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
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

  const list = componentList
    .filter((x) => x.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10)

  const open = Boolean(anchorEl) && list.length > 0
  const id = open ? 'directory-popper' : undefined

  useEscape(setAnchorEl)

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <Input
          endAdornment={<ComponentListBoxPoper {...props} list={componentList} />}
          id='component-directory-input'
          value={query}
          onClick={handleClick}
          fullWidth
          disableUnderline
          aria-autocomplete='none'
          autoComplete='off'
          inputProps={{
            form: {
              autocomplete: 'off'
            }
          }}
          placeholder='Start typing to enter component'
          onChange={(e) => setQuery(e.target.value)}
        />
        <Popper
          id={id}
          open={open}
          anchorEl={anchorEl}
          style={{ zIndex: 1 }}
          transition
          placement='bottom-start'
        >
          {({ TransitionProps }) => (
            <div className={classes.paper}>
              <List component='nav' aria-label='main mailbox folders'>
                {componentList
                  .filter((x) =>
                    x.name.toLowerCase().includes(query.toLowerCase())
                  )
                  .map((component) => (
                    <ListItem
                      button
                      onClick={() => handleComponentSelect(component)}
                    >
                      <ListItemIcon>{component.icon}</ListItemIcon>
                      <ListItemText primary={component.name} />
                    </ListItem>
                  ))}
              </List>
            </div>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  )
}

ComponentDirectorySearch.propTypes = {
  onComponentSelect: PropTypes.func.isRequired
}

ComponentDirectorySearch.defaultProps = {}

export default ComponentDirectorySearch
