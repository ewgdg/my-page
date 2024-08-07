/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import { graphql, useStaticQuery, navigate } from "gatsby"
import MediaCard from "../thumbnail/MediaCard"
import CardDivision from "../thumbnail/CardDivision"
import StyledTitle from "../titles/StyledTitle"
import FlexContainer from "../sections/FlexContainer"
import useFlattenMarkdownData from "../others/useFlattenMarkdownData"
// import "../../queries/postsQueries" //no need , gatsby export query to global
import FadeInSection from "../sections/FadeInSection"

function BlogPreview() {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 2
        filter: {
          frontmatter: {
            templateKey: { eq: "BlogPost" }
            featuredPost: { eq: true }
            isPortfolio: { ne: true }
            isTemplate: { ne: true }
          }
        }
      ) {
        ...PostsFragment
      }
    }
  `)
  const flatten = useFlattenMarkdownData(allMarkdownRemark)
  return (
    <FlexContainer>
      <Container style={{ maxHeight: "100%", height: "600px" }}>
        <div style={{ height: "15%" }}>
          <StyledTitle title="Blog" style={{ height: "50%" }} />
          <p
            style={{
              display: "block",
              textAlign: "center",
              height: "50%",
              boxSizing: "border-box",
            }}
          >
            Know what I am thinking:
          </p>
        </div>
        <div style={{ height: "75%" }}>
          {/* use fade in instead of slide in bc text rendering stutters when animated */}
          <FadeInSection>
            <CardDivision style={{ marginBottom: "25px" }}>
              {flatten.map((cardData, i) => (
                <MediaCard {...cardData} key={i} />
              ))}
            </CardDivision>
          </FadeInSection>
        </div>
        <Grid
          container
          justifyContent="center"
          alignItems="flex-end"
          style={{ maxHeight: "10%" }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              navigate("/blog")
            }}
          >
            View more
          </Button>
        </Grid>
      </Container>
    </FlexContainer>
  )
}

export default BlogPreview
