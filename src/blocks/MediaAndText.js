import React, { useEffect } from 'react'
import { Component } from '../model'
import { FormatTextdirectionLToR, GridOn, Image } from '@material-ui/icons'
import Grid from './Grid'
import { makeid } from '../utils'
import ImageView from './ImageView'
import Paragraph from './Paragraph'

const MediaAndText = (props) => {
  const { handleReplaceComponent, id } = props

  useEffect(() => {
    const elements = []
    const media = new Component('image', 'Image', <Image />, (props) => (
      <ImageView {...props} />
    ))
    media.id = makeid()
    const paragraph = new Component(
      'paragraph',
      'Paragraph',
      <FormatTextdirectionLToR />,
      (props) => (
        <Paragraph variant='body1' {...props} placeholder='Enter paragraph' />
      )
    )
    paragraph.id = makeid()
    elements.push(media)
    elements.push(paragraph)
    const grid = new Component('grid', 'Grid', <GridOn />, (props) => (
      <Grid {...props} />
    ))
    grid.id = makeid()
    grid.properties = { spacing: 2 }
    grid.elements = elements
    handleReplaceComponent(id, grid)
  }, [handleReplaceComponent, id])

  return <div />
}

MediaAndText.propTypes = {}

MediaAndText.defaultProps = {}

export default MediaAndText
