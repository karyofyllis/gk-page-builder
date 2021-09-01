import React, { useCallback, useMemo } from "react";
import { Editable, Slate, useSlate, withReact } from "slate-react";
import { createEditor, Editor, Element as SlateElement, Transforms } from "slate";
import { withHistory } from "slate-history";
import { Box, IconButton, Link as MuiLink, Tooltip, Typography } from "@material-ui/core";
import {
  Code,
  FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatUnderlined,
  Link,
  LinkOff,
  Title
} from "@material-ui/icons";
import { useAnchor } from "../hooks";
import BlockControls from "../core/BlockControls";
import isUrl from "is-url";

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const RichTextText = (props) => {
  const {
    isEditing,
    properties,
    handleUpdateComponentProp,
    id,
    setActivePopperId
  } = props

  const { handleClick, handleClickAway, anchorEl } = useAnchor(
    id,
    setActivePopperId
  )
  const value = properties?.value || initialValue
  const textAlign = properties?.textAlign || 'left'

  const handleChange = useCallback(
    (value) => {
      handleUpdateComponentProp(id, 'value', value)
    },
    [handleUpdateComponentProp, id]
  )

  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const editor = useMemo(
    () => withLinks(withHistory(withReact(createEditor()))),
    []
  )

  const onAlign = (alignment) => {
    handleUpdateComponentProp(id, 'textAlign', alignment)
  }

  const propertyOptions = [
    {
      custom: <MarkButton format='bold' title='Bold' icon={<FormatBold />} />
    },
    {
      custom: (
        <MarkButton format='italic' title='Italic' icon={<FormatItalic />} />
      )
    },
    {
      custom: (
        <MarkButton
          format='underline'
          title='Underline'
          icon={<FormatUnderlined />}
        />
      )
    },
    { custom: <MarkButton format='code' title='Code' icon={<Code />} /> },
    {
      custom: (
        <BlockButton format='heading-one' title='Title 1' icon={<Title />} />
      )
    },
    {
      custom: (
        <BlockButton
          format='heading-two'
          title='Title 2'
          icon={<Title fontSize='small' />}
        />
      )
    },
    {
      custom: (
        <BlockButton
          format='block-quote'
          title='Quote'
          icon={<FormatQuote />}
        />
      )
    },
    {
      custom: (
        <BlockButton
          format='numbered-list'
          title='Numbered List'
          icon={<FormatListNumbered />}
        />
      )
    },
    {
      custom: (
        <BlockButton
          format='bulleted-list'
          title='Bullet List'
          icon={<FormatListBulleted />}
        />
      )
    },
    { custom: <LinkButton title='Add link' icon={<FormatListBulleted />} /> },
    {
      custom: (
        <RemoveLinkButton title='Remove link' icon={<FormatListBulleted />} />
      )
    },
    { custom: <AlignLeftButton onClick={onAlign} alignment={textAlign} /> },
    { custom: <AlignCenterButton onClick={onAlign} alignment={textAlign} /> },
    { custom: <AlignRightButton onClick={onAlign} alignment={textAlign} /> },
    { custom: <AlignJustifyButton onClick={onAlign} alignment={textAlign} /> }
  ]

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      <BlockControls
        onClickAway={handleClickAway}
        anchorEl={anchorEl}
        propertyOptions={propertyOptions}
        {...props}
      >
        <Box
          p={isEditing ? 1 : 0}
          style={{
            minHeight: isEditing ? 100 : 0,
            border: isEditing ? '1px solid' : 'none'
          }}
          onClick={handleClick}
        >
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder='Enter some rich text…'
            style={{ textAlign }}
            spellCheck
            readOnly={!isEditing}
            autoFocus
            onChange={(value) => console.log(value)}
          />
        </Box>
      </BlockControls>
    </Slate>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
      ),
    split: true
  })
  const newProperties = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format
  })

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return (
        <Typography variant='h3' {...attributes}>
          {children}
        </Typography>
      )
    case 'heading-two':
      return (
        <Typography variant='h4' {...attributes}>
          {children}
        </Typography>
      )
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    case 'link':
      return (
        <MuiLink {...attributes} target='_blank' href={element.url}>
          {children}
        </MuiLink>
      )
    default:
      return (
        <Typography variant='body1' {...attributes}>
          {children}
        </Typography>
      )
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon, title }) => {
  const editor = useSlate()
  return (
    <Tooltip title={title}>
      <IconButton
        color={isBlockActive(editor, format) ? 'primary' : 'default'}
        onMouseDown={(event) => {
          event.preventDefault()
          toggleBlock(editor, format)
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  )
}

const MarkButton = ({ format, icon, title }) => {
  const editor = useSlate()
  return (
    <Tooltip title={title}>
      <IconButton
        color={isMarkActive(editor, format) ? 'primary' : 'default'}
        onMouseDown={(event) => {
          event.preventDefault()
          toggleMark(editor, format)
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  )
}
const withLinks = (editor) => {
  const { insertData, insertText, isInline } = editor

  editor.isInline = (element) => {
    return element.type === 'link' ? true : isInline(element)
  }

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertText(text)
    }
  }

  editor.insertData = (data) => {
    const text = data.getData('text/plain')

    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}

const insertLink = (editor, url) => {
  if (editor.selection) {
    wrapLink(editor, url)
  }
}

const isLinkActive = (editor) => {
  const [link] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link'
  })
  return !!link
}

const unwrapLink = (editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link'
  })
}

const wrapLink = (editor, url) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const { selection } = editor
  const isCollapsed = selection && window.Range.collapsed
  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : []
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, link)
  } else {
    Transforms.wrapNodes(editor, link, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

const LinkButton = ({ title }) => {
  const editor = useSlate()
  return (
    <Tooltip title={title}>
      <IconButton
        color={isLinkActive(editor) ? 'primary' : 'default'}
        onMouseDown={(event) => {
          event.preventDefault()
          const url = window.prompt('Enter the URL of the link:')
          if (!url) return
          insertLink(editor, url)
        }}
      >
        <Link />
      </IconButton>
    </Tooltip>
  )
}

const RemoveLinkButton = ({ title }) => {
  const editor = useSlate()

  return (
    <Tooltip title={title}>
      <IconButton
        color={isLinkActive(editor) ? 'primary' : 'default'}
        onMouseDown={(event) => {
          if (isLinkActive(editor)) {
            unwrapLink(editor)
          }
        }}
      >
        <LinkOff />
      </IconButton>
    </Tooltip>
  )
}

const AlignLeftButton = ({ alignment, onClick }) => {
  return (
    <Tooltip title='Align Left'>
      <IconButton
        color={alignment === 'left' ? 'primary' : 'default'}
        onMouseDown={(event) => {
          onClick('left')
        }}
      >
        <FormatAlignLeft />
      </IconButton>
    </Tooltip>
  )
}

const AlignRightButton = ({ alignment, onClick }) => {
  return (
    <Tooltip title='Align Right'>
      <IconButton
        color={alignment === 'right' ? 'primary' : 'default'}
        onMouseDown={(event) => {
          onClick('right')
        }}
      >
        <FormatAlignRight />
      </IconButton>
    </Tooltip>
  )
}

const AlignCenterButton = ({ alignment, onClick }) => {
  return (
    <Tooltip title='Align Center'>
      <IconButton
        color={alignment === 'center' ? 'primary' : 'default'}
        onMouseDown={(event) => {
          onClick('center')
        }}
      >
        <FormatAlignCenter />
      </IconButton>
    </Tooltip>
  )
}

const AlignJustifyButton = ({ alignment, onClick }) => {
  return (
    <Tooltip title='Align Justify'>
      <IconButton
        color={alignment === 'justify' ? 'primary' : 'default'}
        onMouseDown={(event) => {
          onClick('justify')
        }}
      >
        <FormatAlignJustify />
      </IconButton>
    </Tooltip>
  )
}

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }]
  }
]

export default RichTextText
