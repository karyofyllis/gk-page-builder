import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Box, Grid, MuiThemeProvider } from "@material-ui/core";
import ComponentDirectorySearch from "./ComponentDirectorySearch";
import { makeid } from "../utils";
import { componentList } from "../model";
import ComponentListBoxDialog from "./ComponentListBoxDialog";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const Wrapper = (props) =>
  props.muiTheme ? (
    <MuiThemeProvider theme={props.muiTheme}>{props.children}</MuiThemeProvider>
  ) : (
    <Fragment>{props.children}</Fragment>
  )

export const Editor = ({
  onSelectMedia,
  mediaSourceUpdate,
  clearSourceUpdate,
  state,
  setState,
  isEditing,
  theme
}) => {
  const [activePopperId, setActivePopperId] = useState(null)
  const [resourceId, setResourceId] = useState(null)
  const [openComponentDialog, setOpenComponentDialog] = useState(false)
  const [fromDialogOptions, setFromDialogOptions] = useState({
    id: null,
    direction: 0,
    list: []
  })

  const handleSelectMedia = (id) => {
    clearSourceUpdate()
    setResourceId(id)
    onSelectMedia()
  }

  const onNewComponentSideTo = (component) => {
    setOpenComponentDialog(false)
    const { id, direction } = fromDialogOptions
    const newComponent = { ...component, id: makeid() }
    setState((prevState) => {
      const index = prevState.findIndex((x) => x.id === id)
      if (index !== -1) {
        const idx = index + direction
        const array = [...prevState]
        array.splice(idx < 0 ? 0 : idx, 0, newComponent)
        return array
      }
      return prevState.map((block) => {
        const index = block.elements.findIndex((x) => x.id === id)
        if (index !== -1) {
          const idx = index + direction
          const array = [...block.elements]
          array.splice(idx < 0 ? 0 : idx, 0, newComponent)
          return {
            ...block,
            elements: array
          }
        }
        return {
          ...block,
          elements: block.elements.map((el) => {
            const index = el.elements.findIndex((x) => x.id === id)
            if (index !== -1) {
              const idx = index + direction
              const array = [...el.elements]
              array.splice(idx < 0 ? 0 : idx, 0, newComponent)
              return {
                ...el,
                elements: array
              }
            }
            return el
          })
        }
      })
    })
  }

  const handleNewComponent = (component, index) => {
    setState((prevState) => [...prevState, { ...component, id: makeid() }])
  }

  const handleMove = (componentId, direction) => {
    setState((prevState) => {
      const index = prevState.findIndex((x) => x.id === componentId)
      if (index !== -1) {
        return reorder(prevState, index, index + direction)
      }
      return prevState.map((block) => {
        const index = block.elements.findIndex((x) => x.id === componentId)
        if (index !== -1) {
          return {
            ...block,
            elements: reorder(block.elements, index, index + direction)
          }
        }
        return {
          ...block,
          elements: block.elements.map((el) => {
            const index = el.elements.findIndex((x) => x.id === componentId)
            if (index !== -1) {
              return {
                ...el,
                elements: reorder(el.elements, index, index + direction)
              }
            }
            return el
          })
        }
      })
    })
  }
  const handleInsert = (componentId, direction, newComponent) => {
    setState((prevState) => {
      const index = prevState.findIndex((x) => x.id === componentId)
      if (index !== -1) {
        const list = [...prevState, newComponent]
        return reorder(list, list.length - 1, index + direction)
      }
      return prevState
    })
  }

  const handleRemoveBlock = (componentId) => {
    setState((prevState) => {
      return prevState
        .filter((com) => com.id !== componentId)
        .map((com) => {
          return {
            ...com,
            elements: com.elements
              .filter((el) => el.id !== componentId)
              .map((com) => {
                return {
                  ...com,
                  elements: com.elements.filter((el) => el.id !== componentId)
                }
              })
          }
        })
    })
  }

  const addElementToComponent = (containerId, newComponent) => {
    setState((components) =>
      components.map((com) => {
        if (com.id === containerId) {
          return {
            ...com,
            elements: [...com.elements, { ...newComponent, id: makeid() }]
          }
        } else if (com.key === 'grid') {
          return {
            ...com,
            elements: com.elements.map((el) => {
              if (el.id === containerId) {
                return {
                  ...el,
                  elements: [...el.elements, { ...newComponent, id: makeid() }]
                }
              }
              return el
            })
          }
        }
        return com
      })
    )
  }

  const handleReplaceComponent = useCallback(
    (componentId, newComponent) => {
      setState((prevState) =>
        prevState.map((x) => {
          if (x.id === componentId) {
            return newComponent
          }
          return x
        })
      )
    },
    [setState]
  )

  const handleUpdateComponentProp = useCallback(
    (componentId, key, value) => {
      setState((prevState) => {
        return prevState.map((comp) => {
          if (comp.id === componentId) {
            return {
              ...comp,
              properties: {
                ...comp.properties,
                [key]: value
              }
            }
          } else if (comp.key === 'grid') {
            return {
              ...comp,
              elements: comp.elements.map((el) => {
                if (el.id === componentId) {
                  return {
                    ...el,
                    properties: {
                      ...el.properties,
                      [key]: value
                    }
                  }
                } else if (el.key === 'grid') {
                  return {
                    ...el,
                    elements: el.elements.map((subEl) => {
                      if (subEl.id === componentId) {
                        return {
                          ...subEl,
                          properties: {
                            ...subEl.properties,
                            [key]: value
                          }
                        }
                      }
                      return subEl
                    })
                  }
                }
                return el
              })
            }
          }
          return comp
        })
      })
    },
    [setState]
  )

  useEffect(() => {
    if (mediaSourceUpdate && resourceId) {
      handleUpdateComponentProp(resourceId, 'src', mediaSourceUpdate)
    }
  }, [handleUpdateComponentProp, mediaSourceUpdate, resourceId])

  const handleEnter = () => {
    const el = document.getElementById('component-directory-input')
    el.focus()
    el.click()
  }

  return (
    <Wrapper theme={theme}>
      <Box>
        <Box>
          <Grid container direction='column' spacing={2}>
            {state.map(
              (
                {
                  render: Body,
                  props,
                  children,
                  id,
                  elements,
                  properties,
                  icon,
                  name
                },
                index
              ) => (
                <Grid item key={index}>
                  <Body
                    id={id}
                    key={index}
                    onRoot
                    setFromDialogOptions={setFromDialogOptions}
                    openComponentDialog={() => setOpenComponentDialog(true)}
                    list={componentList}
                    index={index}
                    isEditing={isEditing}
                    elements={elements}
                    properties={properties}
                    icon={icon}
                    name={name}
                    onSelectMedia={handleSelectMedia}
                    handleEnter={handleEnter}
                    handleRemoveBlock={handleRemoveBlock}
                    addElementToComponent={addElementToComponent}
                    handleMove={handleMove}
                    handleInsert={handleInsert}
                    handleUpdateComponentProp={handleUpdateComponentProp}
                    handleReplaceComponent={handleReplaceComponent}
                    activePopperId={activePopperId}
                    setActivePopperId={setActivePopperId}
                  />
                </Grid>
              )
            )}
          </Grid>
          <Box mt={2} />
          {isEditing && (
            <ComponentDirectorySearch onComponentSelect={handleNewComponent} />
          )}
          {isEditing && (
            <ComponentListBoxDialog
              open={openComponentDialog}
              onClose={() => setOpenComponentDialog(false)}
              onComponentSelect={onNewComponentSideTo}
              list={fromDialogOptions.list}
            />
          )}
        </Box>
      </Box>
    </Wrapper>
  )
}

export default Editor
