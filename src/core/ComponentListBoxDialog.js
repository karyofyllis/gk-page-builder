import React from "react";
import Dialog from "@material-ui/core/Dialog";
import ComponentListBox from "./ComponentListBox";

export default function ComponentListBoxDialog({
  onClose,
  onComponentSelect,
  open,
  list
}) {
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={onClose}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
    >
      <ComponentListBox onComponentSelect={onComponentSelect} list={list} />
    </Dialog>
  )
}
