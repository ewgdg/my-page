/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles(height => ({
  root: {
    height,
    width: "100%",
    userSelect: "none",
    // position: "relative",
    // border: "red solid 2px",
    // pointerEvents: "none",
  },
}))

// Section component whose parent should be type of Container
function Section({ children, forwardedRef, style, id, height = "100vh" }) {
  const classes = useStyles(height)

  return (
    <section
      ref={forwardedRef}
      className={`${classes.root} section`}
      style={{ boxSizing: "border-box", userSelect: "none", ...style }}
      {...(id ? { id } : {})}
    >
      {children}
    </section>
  )
}

Section.propTypes = {
  children: PropTypes.node,
  // forwardedRef: PropTypes.shape({
  //   current: PropTypes.any,
  // }),
  forwardedRef: PropTypes.func,
}
Section.defaultProps = {
  children: undefined,
  forwardedRef: undefined,
}

export default Section
