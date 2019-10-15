/* eslint-disable react/require-default-props */
import React from "react"
import PropTypes from "prop-types"
import { IndexPageTemplate } from "../../templates/IndexPage"

const IndexPagePreview = ({ entry }) => {
  const data = entry.getIn(["data"]).toJS()

  if (data) {
    return <IndexPageTemplate jumbotronProps={data.jumbotron} />
  }
  return <div>Loading...</div>
}

IndexPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
}

export default IndexPagePreview