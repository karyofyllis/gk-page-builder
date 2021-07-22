import React, { useState } from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import { Button, DialogActions, DialogContent, Input } from '@material-ui/core'

export default function WidthDialog(props) {
  const { onClose, open, initialValue, onConfirm } = props
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
      <DialogTitle id='simple-dialog-title'>Set Width</DialogTitle>
      <DialogContent>
        <Input
          placeholder='Enter width in pixels'
          onChange={(e) => setValue(e.target.value)}
          value={value}
          type='number'
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
