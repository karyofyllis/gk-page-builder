import React, { useState } from "react";

import { ClickAwayListener, IconButton, makeStyles, Popper } from "@material-ui/core";
import { AddCircle, AddCircleOutline } from "@material-ui/icons";
import PropTypes from "prop-types";
import { useEscape } from "../hooks";
import { componentList } from "../model";
import ComponentListBox from "./ComponentListBox";

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

const ComponentListBoxPoper = (props) => {
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
        <IconButton color='primary' onClick={handleClick}>
          {props.outlined ? <AddCircleOutline /> : <AddCircle />}
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
            <ComponentListBox
              onComponentSelect={handleComponentSelect}
              list={props.list}
            />
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  )
}

ComponentListBoxPoper.propTypes = {
  onComponentSelect: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired
}

ComponentListBoxPoper.defaultProps = {
  list: componentList
}

export default ComponentListBoxPoper
