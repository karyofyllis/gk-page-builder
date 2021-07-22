# gk-page-builder

> Page builder for react MUI

[![NPM](https://img.shields.io/npm/v/gk-page-builder.svg)](https://www.npmjs.com/package/gk-page-builder) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save gk-page-builder
```

## Usage

```jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@material-ui/core";
import { Editor, initState } from 'gk-page-builder'
import 'gk-page-builder/dist/index.css'

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem("blocks"));
    return initState(stored);
  } catch (e) {
    return [];
  }
}

const App = () => {
  const blocks = loadState();
  const [state, setState] = useState(blocks);
  const [isEditing, setIsEditing] = useState(false);
  const [openLibrary, setOpenLibrary] = useState(false);
  const [image, setImage] = useState("");

  const handleSave = () => {
    const blocksString = JSON.stringify(state);
    console.log(blocksString);
    localStorage.setItem("blocks", blocksString);
  };

  return <Container>
    <Box mt={6} />
    <Button onClick={() => setIsEditing(!isEditing)}>
      {isEditing ? "Preview" : "Edit"}
    </Button>
    <Button onClick={handleSave}>Save</Button>
    <Box mt={6} />
    <Editor
      state={state}
      setState={setState}
      isEditing={isEditing}
      mediaSourceUpdate={image}
      clearSourceUpdate={() => setImage("")}
      onSelectMedia={() => setOpenLibrary(true)}
    />
    <Dialog
      maxWidth={"md"}
      fullWidth
      open={openLibrary}
      onClose={() => setOpenLibrary(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Use Google's location service?"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item>
            <img
              onClick={() => {
                setImage("https://picsum.photos/id/237/200/300");
                setOpenLibrary(false);
              }}
              alt={"placeholder"}
              src={"https://picsum.photos/id/237/200/300"}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenLibrary(false)} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  </Container>
}

export default App

```

## License

MIT © [https://github.com/karyofyllis](https://github.com/https://github.com/karyofyllis)
