import React, { useEffect, useMemo, useState, Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { CardActionArea, Fab, useMediaQuery } from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import PropTypes from 'prop-types'

const useStyles = makeStyles({
  fab: {
    width: 52,
    height: 52,
    position: 'absolute',
    top: 'calc(50% - 26px)',
    backgroundColor: 'white'
  }
})

function Carousel(props) {
  const classes = useStyles()
  const {
    items,
    renderItem,
    breakpoints,
    hideProgress,
    hideArrows,
    loading,
    loadingItems,
    spacing
  } = props

  const [currentIndex, setCurrentIndex] = useState(0)

  const xs = useMediaQuery('(max-width:0px)')
  const sm = useMediaQuery('(max-width:600px)')
  const md = useMediaQuery('(max-width:960px)')
  const lg = useMediaQuery('(max-width:1280px)')
  const xl = useMediaQuery('(max-width:1920px)')

  const colsPerSlide = useMemo(() => {
    switch (true) {
      case xs:
        return breakpoints.xs
      case sm:
        return breakpoints.sm
      case md:
        return breakpoints.md
      case lg:
        return breakpoints.lg
      case xl:
        return breakpoints.xl
      default:
        return breakpoints.xl
    }
  }, [
    breakpoints.lg,
    breakpoints.md,
    breakpoints.sm,
    breakpoints.xl,
    breakpoints.xs,
    lg,
    md,
    sm,
    xl,
    xs
  ])

  const finalItems = useMemo(() => {
    if (loading) return [...Array(loadingItems).map((k, i) => i)]
    return items
  }, [items, loading, loadingItems])

  const groups = useMemo(() => {
    const slides = []
    const temp = [...finalItems]
    while (temp.length) {
      slides.push(temp.splice(0, colsPerSlide))
    }
    return slides
  }, [colsPerSlide, finalItems])

  useEffect(() => {
    setCurrentIndex(0)
  }, [colsPerSlide, items.length])

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
    else setCurrentIndex(groups.length - 1)
  }

  const handleNext = () => {
    if (currentIndex === groups.length - 1) setCurrentIndex(0)
    else setCurrentIndex(currentIndex + 1)
  }

  const renderProgress = () => {
    if (hideProgress) return null
    if (groups.length < 2) return null
    return (
      <Box display='flex' mt={4}>
        {groups.map((group, index) => (
          <CardActionArea
            onClick={() => setCurrentIndex(index)}
            key={index}
            style={{
              flex: 1,
              height: 4,
              backgroundColor:
                index === currentIndex ? 'rgba(112, 112, 112, 0.8)' : '#d8d8d8'
            }}
          />
        ))}
      </Box>
    )
  }

  const renderArrows = () => {
    if (hideArrows) return null
    if (groups.length < 2) return null
    return (
      <Fragment>
        <Fab onClick={handlePrev} className={classes.fab} style={{ left: -8 }}>
          <ChevronLeft fontSize='large' />
        </Fab>
        <Fab className={classes.fab} onClick={handleNext} style={{ right: -8 }}>
          <ChevronRight fontSize='large' />
        </Fab>
      </Fragment>
    )
  }

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <div style={{ marginLeft: -spacing, marginRight: -spacing }}>
          <SwipeableViews
            resistance
            index={currentIndex}
            onChangeIndex={setCurrentIndex}
          >
            {groups.map((group, index) => (
              <Grid container key={index}>
                {group.map((item, idx) => (
                  <Grid
                    style={{ padding: `0 ${spacing}px` }}
                    item
                    key={idx}
                    xs={Math.round(12 / colsPerSlide)}
                  >
                    {renderItem(item, index, loading)}
                  </Grid>
                ))}
              </Grid>
            ))}
          </SwipeableViews>
        </div>
        {renderArrows()}
      </div>
      {renderProgress()}
    </div>
  )
}

export default Carousel

Carousel.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  breakpoints: PropTypes.object,
  hideProgress: PropTypes.bool,
  hideArrows: PropTypes.bool,
  loading: PropTypes.bool,
  renderLoadingItems: PropTypes.func,
  loadingItems: PropTypes.number,
  spacing: PropTypes.number
}

Carousel.defaultProps = {
  items: [],
  breakpoints: {
    xl: 4,
    lg: 3,
    md: 2,
    sm: 1,
    xs: 1
  },
  hideProgress: false,
  hideArrows: false,
  loadingItems: 4,
  spacing: 8
}
