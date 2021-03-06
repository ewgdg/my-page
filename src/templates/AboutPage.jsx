/* eslint-disable react/prop-types */
import React from "react"
import { graphql } from "gatsby"

import SEO from "../components/header/SEO"
import HeaderContainer from "../components/header/HeaderContainer"

import BubbleTank from "../components/bubbles/BubbleTank"
import Footer from "../components/footer/Footer"
import useResetScrollTop from "../contexts/useResetScrollTop"

export const AboutPagePreview = ({ jumbotronProps }) => {
  return (
    <div>
      <HeaderContainer
        headerProps={{ color: "white", position: "absolute" }}
        jumbotronProps={jumbotronProps}
      />
    </div>
  )
}

export const AboutPageTemplate = ({ jumbotronProps, facts }) => {
  const tileData = []
  tileData.length = 20
  tileData.fill(1)
  const cellHeight = 200
  const cellsPerRow = 5

  return (
    <div>
      <HeaderContainer
        headerProps={{ color: "white", position: "absolute" }}
        jumbotronProps={jumbotronProps}
      />
      <BubbleTank
        data={facts}
        cellHeight={cellHeight}
        cellsPerRow={cellsPerRow}
        header="Some fun facts about me"
      />
      <Footer />
    </div>
  )
}

export default function AboutPage({ data }) {
  const { frontmatter } = data.markdownRemark
  const { facts } = frontmatter

  useResetScrollTop()
  return (
    <>
      <SEO title="About" />
      <AboutPageTemplate
        jumbotronProps={frontmatter.jumbotronProps}
        facts={facts}
      />
    </>
  )
}
export const query = graphql`
  query AboutPageTempate {
    markdownRemark(frontmatter: { templateKey: { eq: "AboutPage" }, isTemplate:{ ne: true}  }) {
      frontmatter {
        jumbotronProps: jumbotron {
          headline
          subtitle
          image {
            childImageSharp {
              fluid(maxWidth: 2048, quality: 80) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
        facts {
          title
          description
          image {
            childImageSharp {
              fluid(maxWidth: 700, quality: 60) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          links
        }
      }
    }
  }
`
