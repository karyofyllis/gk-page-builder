import React, { useState } from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import { Button, DialogActions, DialogContent, Input } from '@material-ui/core'

export default function InsertDialog(props) {
  const { onClose, open, initialValue, onConfirm, name = 'URL' } = props
  const [value, setValue] = useState(initialValue)

  const handleClose = () => {
    onConfirm(value)
  }

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='simple-dialog-title'
      open={open}
      maxWidth='sm'
      fullWidth
    >
      <DialogTitle id='simple-dialog-title'>Insert {name}</DialogTitle>
      <DialogContent>
        <Input
          placeholder={`Enter ${name}`}
          onChange={(e) => setValue(e.target.value)}
          value={value}
          autoFocus
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}
