import React from 'react'
import { Box, Grid as MuiGrid, makeStyles } from '@material-ui/core'
import {
  FormatAlignLeft,
  VerticalAlignBottom,
  VerticalAlignCenter,
  VerticalAlignTop,
  ViewAgenda
} from '@material-ui/icons'
import { componentList } from '../model'
import BlockControls from '../core/BlockControls'
import PropertyMenu from '../core/PropertyMenu'
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter'
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify'
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft'
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight'
import ViewColumnIcon from '@material-ui/icons/ViewColumn'
import ViewAgendaIcon from '@material-ui/icons/ViewAgenda'
import { useAnchor } from '../hooks'
import SpaceBarIcon from '@material-ui/icons/SpaceBar'
import ComponentListBoxPoper from '../core/ComponentListBoxPoper'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    border: '1px solid'
  },
  paperActive: {
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.primary.main}`
  }
}))

function Grid(props) {
  const {
    elements,
    addElementToComponent,
    id,
    handleRemoveBlock,
    isEditing,
    handleUpdateComponentProp,
    properties,
    onSelectMedia,
    handleInsert,
    handleMove,
    insideGrid,
    handleReplaceComponent,
    setFromDialogOptions,
    openComponentDialog
  } = props

  const classes = useStyles()
  const { handleClick, handleClickAway, anchorEl } = useAnchor()

  const propertyOptions = [
    {
      element: (
        <PropertyMenu
          value={properties.direction || directionProperty.options[0].value}
          property={{
            ...directionProperty,
            icon: getDirectionIcon(properties.direction)
          }}
          onChange={(opt) =>
            handleUpdateComponentProp(id, 'direction', opt.value)
          }
        />
      )
    },
    {
      element: (
        <PropertyMenu
          property={{
            ...justifyProperty,
            icon: getJustifyIcon(properties.justifyContent)
          }}
          value={properties.justifyContent || justifyProperty.options[0].value}
          onChange={(opt) =>
            handleUpdateComponentProp(id, 'justifyContent', opt.value)
          }
        />
      )
    },
    {
      element: (
        <PropertyMenu
          property={{
            ...alignmentProperty,
            icon: getAlignIcon(properties.alignItems)
          }}
          value={properties.alignItems || alignmentProperty.options[0].value}
          onChange={(opt) =>
            handleUpdateComponentProp(id, 'alignItems', opt.value)
          }
        />
      )
    },
    {
      element: (
        <PropertyMenu
          property={spacingProperty}
          value={properties.spacing || spacingProperty.options[0].value}
          onChange={(opt) =>
            handleUpdateComponentProp(id, 'spacing', opt.value)
          }
        />
      )
    }
  ]

  const handleChildClick = (e) => {
    e.stopPropagation()
    handleClickAway()
  }

  const onComponentSelect = (newComponent) => {
    addElementToComponent(id, newComponent)
  }

  const list = insideGrid
    ? componentList.filter((x) => x.key !== 'grid' && x.key !== 'simpleGrid')
    : componentList.filter((x) => x.key !== 'simpleGrid')

  return (
    <BlockControls
      onClickAway={handleClickAway}
      anchorEl={anchorEl}
      propertyOptions={propertyOptions}
      {...props}
    >
      <MuiGrid
        container
        style={{ flex: 1 }}
        spacing={properties?.spacing || 0}
        className={
          isEditing && (anchorEl ? classes.paperActive : classes.paper)
        }
        onClick={handleClick}
        direction={properties?.direction}
        alignItems={properties?.alignItems}
        justifyContent={properties?.justifyContent}
      >
        {elements?.map(
          (
            { render: Body, props, children, id, elements, properties },
            index
          ) => {
            const colSize = properties?.colSize || 'auto'
            return (
              <MuiGrid
                key={index}
                item
                onClick={handleChildClick}
                md={colSize}
                xs={12}
              >
                <Body
                  id={id}
                  list={list}
                  key={index}
                  index={index}
                  isEditing={isEditing}
                  elements={elements}
                  setFromDialogOptions={setFromDialogOptions}
                  openComponentDialog={openComponentDialog}
                  properties={properties}
                  insideGrid
                  handleInsert={handleInsert}
                  handleMove={handleMove}
                  onSelectMedia={onSelectMedia}
                  onRoot={false}
                  handleRemoveBlock={handleRemoveBlock}
                  addElementToComponent={addElementToComponent}
                  handleUpdateComponentProp={handleUpdateComponentProp}
                  handleReplaceComponent={handleReplaceComponent}
                />
              </MuiGrid>
            )
          }
        )}
        {isEditing && (
          <MuiGrid item xs={12}>
            <Box display='flex' justifyContent='center'>
              <ComponentListBoxPoper
                {...props}
                list={list}
                onComponentSelect={onComponentSelect}
              />
            </Box>
          </MuiGrid>
        )}
      </MuiGrid>
    </BlockControls>
  )
}

export default Grid

function getJustifyIcon(justify) {
  switch (justify) {
    case 'center':
      return <FormatAlignCenterIcon />
    case 'flex-end':
      return <FormatAlignRightIcon />
    case 'space-between':
    case 'space-around':
    case 'space-evenly':
      return <FormatAlignJustifyIcon />
    default:
      return <FormatAlignLeftIcon />
  }
}
function getAlignIcon(justify) {
  switch (justify) {
    case 'flex-end':
      return <VerticalAlignBottom />
    case 'stretch':
    case 'baseline':
    case 'center':
      return <VerticalAlignCenter />
    default:
      return <VerticalAlignTop />
  }
}

function getDirectionIcon(justify) {
  switch (justify) {
    case 'column':
      return <ViewAgendaIcon />
    default:
      return <ViewColumnIcon />
  }
}

const directionProperty = {
  icon: <ViewAgenda />,
  label: 'Direction',
  options: [
    {
      label: 'Row',
      value: 'row'
    },
    {
      label: 'Column',
      value: 'column'
    }
  ]
}

const alignmentProperty = {
  icon: <ViewAgenda />,
  label: 'Align Items',
  options: [
    {
      label: 'Start',
      value: 'flex-start'
    },
    {
      label: 'Center',
      value: 'center'
    },
    {
      label: 'End',
      value: 'flex-end'
    },
    {
      label: 'Stretch',
      value: 'stretch'
    },
    {
      label: 'Baseline',
      value: 'baseline'
    }
  ]
}

const justifyProperty = {
  icon: <FormatAlignLeft />,
  label: 'Justify Content',
  options: [
    {
      label: 'Start',
      value: 'flex-start'
    },
    {
      label: 'Center',
      value: 'center'
    },
    {
      label: 'End',
      value: 'flex-end'
    },
    {
      label: 'Space between',
      value: 'space-between'
    },
    {
      label: 'Space around',
      value: 'space-around'
    },
    {
      label: 'Space evenly',
      value: 'space-evenly'
    }
  ]
}

const spacingProperty = {
  icon: <SpaceBarIcon />,
  label: 'Spacing',
  options: [
    {
      label: 'No Space',
      value: 0
    },
    {
      label: '1',
      value: 1
    },
    {
      label: '2',
      value: 2
    },
    {
      label: '3',
      value: 3
    },
    {
      label: '4',
      value: 4
    },
    {
      label: '5',
      value: 5
    }
  ]
}
