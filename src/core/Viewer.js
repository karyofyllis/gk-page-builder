import React from "react";
import Editor from "./Editor";
import PropTypes from "prop-types";

function Viewer(props) {
  const { state } = props
  return <Editor state={state} isEditing={false} />
}

Viewer.propTypes = {
  state: PropTypes.array.isRequired
}

Viewer.defaultProps = {
  state: []
}

export default Viewer
