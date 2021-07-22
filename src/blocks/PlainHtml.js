import React from 'react'
import BlockControls from '../core/BlockControls'
import { useAnchor } from '../hooks'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/theme-github'

function PlainHtml(props) {
  const {
    isEditing,
    handleRemoveBlock,
    id,
    properties,
    handleUpdateComponentProp
  } = props

  const html = properties?.html || ''

  const handleChange = (newValue) => {
    // const newValue = e.target.value;
    handleUpdateComponentProp(id, 'html', newValue)
  }
  const { handleClick, handleClickAway, anchorEl } = useAnchor()

  return (
    <BlockControls
      onClickAway={handleClickAway}
      handleRemoveBlock={handleRemoveBlock}
      anchorEl={anchorEl}
      propertyOptions={[]}
      {...props}
    >
      {isEditing ? (
        <div onClick={handleClick}>
          <AceEditor
            mode='html'
            theme='github'
            value={html}
            style={{ width: '100%' }}
            onChange={handleChange}
            name={id}
            editorProps={{ $blockScrolling: true }}
          />
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </BlockControls>
  )
}

export default PlainHtml
