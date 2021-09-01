import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardActionArea, CardContent, Grid, List, ListItem, TextField, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { componentList } from "../model";

const useStyles = makeStyles((theme) => ({
  paper: {
    border: '1px solid',
    padding: theme.spacing(1),
    width: 400,
    backgroundColor: theme.palette.background.paper
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60
  }
}))

function ComponentListBox(props) {
  const { list, onComponentSelect } = props
  const classes = useStyles()
  const [query, setQuery] = useState('')

  const handleComponentSelect = (component) => {
    setQuery('')
    onComponentSelect(component)
  }

  return (
    <div className={classes.paper}>
      <List component='nav' aria-label='main mailbox folders'>
        <ListItem>
          <TextField
            autoFocus
            fullWidth
            placeholder='Start typing...'
            label='Block Library'
            variant='filled'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </ListItem>
        <ListItem component={Grid} container spacing={2}>
          {list
            .filter((x) => x.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 9)
            .map((component, index) => (
              <Grid item xs={4} key={index}>
                <Card variant='outlined'>
                  <CardActionArea
                    onClick={() => handleComponentSelect(component)}
                  >
                    <CardContent className={classes.card}>
                      {component.icon}
                      <Typography style={{ textAlign: 'center' }}>
                        {component.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
        </ListItem>
      </List>
    </div>
  )
}

ComponentListBox.propTypes = {
  onComponentSelect: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired
}

ComponentListBox.defaultProps = {
  list: componentList
}

export default ComponentListBox
