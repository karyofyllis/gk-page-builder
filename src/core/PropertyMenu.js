import React from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  paper: {
    border: '1px solid',
    padding: theme.spacing(1),
    marginTop: 8,
    width: 250,
    backgroundColor: theme.palette.background.paper
  }
}))

export default function PropertyMenu({ property, onChange, value }) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <div className={classes.root}>
      <div>
        <Tooltip title={property.label}>
          <IconButton
            onClick={handleToggle}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup='true'
          >
            {property.icon}
          </IconButton>
        </Tooltip>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          placement='bottom-start'
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <div className={classes.paper}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id='menu-list-grow'
                    onKeyDown={handleListKeyDown}
                  >
                    {property.options.map((opt, index) => (
                      <MenuItem
                        key={index}
                        onClick={(e) => {
                          onChange(opt)
                          handleClose(e)
                        }}
                      >
                        {opt.icon}
                        <span
                          style={{
                            fontWeight: value === opt.value ? 'bold' : 'normal'
                          }}
                        >
                          {opt.label}
                        </span>
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </div>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  )
}
