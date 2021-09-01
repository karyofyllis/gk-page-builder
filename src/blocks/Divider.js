import React from "react";
import { Box, Divider as MuiDivider } from "@material-ui/core";
import BlockControls from "../core/BlockControls";
import { useAnchor } from "../hooks";

function Divider(props) {
  const { id, setActivePopperId } = props
  const { handleClick, handleClickAway, anchorEl } = useAnchor(
    id,
    setActivePopperId
  )
  return (
    <BlockControls
      onClickAway={handleClickAway}
      anchorEl={anchorEl}
      propertyOptions={[]}
      {...props}
    >
      <Box py={1} onClick={handleClick}>
        <MuiDivider />
      </Box>
    </BlockControls>
  )
}

export default Divider
