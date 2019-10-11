/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable import/no-unresolved */
/* eslint-disable new-cap */
import React, {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useContext,
} from "react"
import { TweenMax, TimelineLite, Power3, Power1 } from "gsap/TweenMax"
// import ScrollMagic from "scrollmagic-with-ssr"
// import "scrollmagic/scrollmagic/minified/plugins/animation.gsap.min"
// import "scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min"

// import { TimelineMax } from "gsap/TimelineMax"
import CharSequence from "components/sections/CharSequence"
import { makeStyles } from "@material-ui/styles"
import LayoutContext from "contexts/LayoutContext"

import { getController, ScrollMagic } from "plugins/scrollmagic"
import { ScrollDetector } from "utilities/scroll"
import FlexContainer from "../sections/FlexContainer"
import { debounce } from "../../utilities/throttle"

const useStyles = makeStyles({
  charSequenceContainer: {
    height: "4rem",
    width: "100%",
    fontSize: "3.5rem",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "20%",
  },
  charSequenceBackground: {
    backgroundImage:
      "linear-gradient(130deg, #a7fcf5 15%, #1fc8cb 50%, #2cb5d8 75%)",
    position: "absolute",
    top: 0,
    left: 0,
    width: "120%",
    height: "100%",
    zIndex: -1,
    opacity: 0.6,
  },
  ribbon: {
    width: "100%",
    height: "350px",
    backgroundColor: "rgb(255, 32, 126)",
    opacity: 0.6,
  },
  skewed: {
    transform: "skewY(-15deg)",
  },
  textContainerInsideRibbon: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "0 10% 0 10%",
  },
})

function About() {
  const ribbonContainerRef = useRef(null)
  const ribbonRef = useRef(null)
  const charSequenceBackgroundRef = useRef(null)
  const charRefs = useRef([])
  const context = useContext(LayoutContext)
  if (!context.scrollLayer) return null
  const classes = useStyles()
  // add scrollmagic controll
  useEffect(() => {
    // if (!ribbonContainerRef.current || (charRefs.length > 0 && !charRefs[0])) {
    //   console.log("check n ull")
    //   return () => {}
    // }

    const controller = getController(context.scrollLayer)
    // console.log(controller)
    const animation = new TimelineLite()
    // animate ribbon
    animation
      .add("startAnimation")
      .from(ribbonRef.current, 0.7, {
        scaleX: 0,
        transformOrigin: "right",
        ease: Power3.easeInOut,
      })
      .add("ribbonFinished")
      .from(charSequenceBackgroundRef.current, 0.7, {
        scaleX: 0,
        transformOrigin: "left",
        ease: Power3.easeInOut,
      })

    animation
      .staggerTo(
        charRefs.current,
        0.15,
        {
          fontSize: "2em",
          stagger: 0.1,
          ease: Power1.easeInOut,
        },
        undefined,
        "startAnimation+=0.2"
      )
      .staggerTo(
        charRefs.current,
        0.15,
        {
          fontSize: "1em",
          stagger: 0.1,
          ease: Power1.easeInOut,
        },
        undefined,
        "startAnimation+=0.35"
      )
      .staggerFrom(
        ".animatedline",
        0.1,
        {
          opacity: 0,
          stagger: 0.05,
        },
        undefined,
        "ribbonFinished"
      )
      .add("endAnimation")

    // const containerScene = new ScrollMagic.Scene({
    //   triggerElement: ribbonContainerRef.current,
    // })
    // containerScene
    //   // .setTween(blockTween)
    //   .setTween(animation)
    //   .addIndicators()
    // .addTo(controller)

    animation.pause()

    const scrollDetector = new ScrollDetector(
      context.scrollLayer,
      ribbonContainerRef.current,
      0.5,
      0,
      0
    )
    scrollDetector.setEventListener(progress => {
      if (progress > 0) {
        animation.play()
      } else {
        animation.reverse()
      }
    })
    scrollDetector.update()

    // console.log(containerScene)
    // const onResize = debounce(() => {
    //   containerScene.refresh()
    //   // scene.progress(old)
    // }, 100)
    // // reset trigger elem when resizing as start position may changes
    // window.addEventListener("resize", onResize)

    // document.querySelector("div#ribbon").addEventListener("scroll", e => {
    //   console.log(e)
    // })
    return () => {
      // animation = null
      // if (controller) controller.removeScene(containerScene)
      // containerScene.destroy()
      animation.progress(1)
      animation.kill()
      // window.removeEventListener("resize", onResize)
      scrollDetector.destroy()
    }
  }, [context])

  return (
    <FlexContainer>
      <div style={{ width: "100%", height: "auto" }}>
        <div style={{ display: "inline-block" }}>
          <div className={classes.charSequenceContainer}>
            <CharSequence string="About" charRefs={charRefs} />
            <div
              ref={charSequenceBackgroundRef}
              className={classes.charSequenceBackground}
            />
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div
            id="ribbonContainer"
            ref={ribbonContainerRef}
            className={classes.skewed}
          >
            <div id="ribbon" ref={ribbonRef} className={classes.ribbon} />
          </div>
          <div className={classes.textContainerInsideRibbon}>
            <div id="animatedLineGroup">
              <h2 className="animatedline">
                My passion is about solving challenging problem.
              </h2>
              <div>
                <div className="animatedline">
                  And that is <a href="#">why</a> I made this page.
                </div>
                <div className="animatedline">
                  I like technology, gaming, and programming.
                </div>
                <div className="animatedline" style={{ opacity: 0.8 }}>
                  If you want to learn more about me, keep reading.
                </div>
                <div className="animatedline" style={{ opacity: 0.6 }}>
                  Or send me an email (or call).
                </div>
                <div className="animatedline" style={{ opacity: 0.4 }}>
                  ... ...
                </div>
                <div className="animatedline" style={{ opacity: 0.2 }}>
                  ...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FlexContainer>
  )
}

export default About