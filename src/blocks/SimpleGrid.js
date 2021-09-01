import React from "react";
import { useAnchor } from "../hooks";
import BlockControls from "../core/BlockControls";
import { Box, Card, CardActionArea, CardContent, CardHeader, Grid as MuiGrid, Typography } from "@material-ui/core";
import { Component } from "../model";
import { makeid } from "../utils";
import { GridOn, ViewColumn } from "@material-ui/icons";
import Grid from "./Grid";

const grids = [[12], [6, 6], [4, 8], [8, 4], [4, 4, 4], [3, 6, 3]]

function SimpleGrid(props) {
  const { id, handleReplaceComponent, name, isEditing, setActivePopperId } = props

  const { handleClick, handleClickAway, anchorEl } = useAnchor(
    id,
    setActivePopperId
  )

  const handleReplace = (childrenSizes) => {
    const elements = []
    childrenSizes.forEach((size) => {
      const item = new Component('grid', 'Grid', <GridOn />, (props) => (
        <Grid {...props} />
      ))
      item.id = makeid()
      item.properties = { colSize: size }
      elements.push(item)
    })
    const grid = new Component('grid', 'Grid', <GridOn />, (props) => (
      <Grid {...props} />
    ))
    grid.id = makeid()
    grid.elements = elements
    handleReplaceComponent(id, grid)
  }

  return isEditing ? (
    <BlockControls
      onClickAway={handleClickAway}
      anchorEl={anchorEl}
      propertyOptions={[]}
      {...props}
    >
      <Card variant='outlined' onClick={handleClick}>
        <CardHeader title={name} avatar={<ViewColumn />} />
        <CardContent>
          <Typography>Select the layout you want to start</Typography>
          <Box mt={2} />
          <MuiGrid container spacing={2}>
            {grids.map((gridArray, index) => (
              <TemplateCard
                key={index}
                array={gridArray}
                handleReplace={handleReplace}
              />
            ))}
          </MuiGrid>
        </CardContent>
      </Card>
    </BlockControls>
  ) : null
}

const TemplateCard = ({ array, handleReplace }) => {
  return (
    <MuiGrid item style={{ flex: 1 }}>
      <Card variant='outlined'>
        <CardActionArea onClick={() => handleReplace(array)}>
          <CardContent>
            <MuiGrid container wrap='nowrap'>
              {array.map((x, index) => (
                <MuiGrid
                  key={index}
                  item
                  xs={x}
                  style={{ border: '1px solid', height: 30 }}
                />
              ))}
            </MuiGrid>
          </CardContent>
        </CardActionArea>
      </Card>
      <Typography style={{ textAlign: 'center', marginTop: '8px' }}>
        {array.toString().replaceAll(',', '/')}
      </Typography>
    </MuiGrid>
  )
}

export default SimpleGrid
