import React, { useState, useCallback, useRef } from "react"
import ChatIcon from "@material-ui/icons/Chat"
import Popover from "@material-ui/core/Popover"
import { makeStyles } from "@material-ui/core/styles"
import Zoom from "@material-ui/core/Zoom"
import {
  usePopupState,
  bindTrigger,
  bindPopover,
} from "material-ui-popup-state/hooks"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import useScrollTrigger from "../pageScroll/useScrollTrigger"
import MessageList from "./MessageList"
import * as chatbot from "./chatbotAPI"

const useStyles = makeStyles({
  icon: {
    position: ({ icon }) => icon.position || "fixed",
    bottom: ({ icon }) => icon.bottom || "50%",
    left: ({ icon }) => icon.left || "55%",
    fontSize: "3.5rem",
    "&:hover": {
      color: "#93f145",
    },
  },
  box: {},
})

// eslint-disable-next-line react/prop-types
function Chat({ iconStyle }) {
  const popupState = usePopupState({
    variant: "popover",
    popupId: "chatPopover",
  })
  const classes = useStyles({ icon: iconStyle || {} })
  // useRef wont notify the change , but it is ok bc the ref is asked when user call it after ref is settled
  // const iconRef = useRef()
  const trigger = useScrollTrigger({
    threshold: 100,
  })

  const [messages, setMessages] = useState([])

  // we can replace this with update setUpdate = useState simply for rerender when we have textRef
  const [text, setText] = useState("")
  const textRef = useRef(text)

  const waitForResponse = useCallback(
    async req => {
      const replyObj = {
        loading: true,
      }
      setMessages(prev => [...prev, replyObj])
      const reply = await chatbot.requestReply(req)

      replyObj.loading = false
      replyObj.data = reply
      setMessages(prev => [...prev])
    },
    [setMessages]
  )
  const [controllable, setControllable] = useState(true)
  const controllableRef = useRef(controllable)
  const unblock = () => {
    setControllable(true)
    controllableRef.current = true
  }
  const block = () => {
    setControllable(false)
    controllableRef.current = false
  }

  const sendMessage = useCallback(async () => {
    if (textRef.current && controllableRef.current) {
      const question = textRef.current
      textRef.current = ""
      setMessages(oldmsgs => [...oldmsgs, { data: question, fromClient: true }])
      setText("")
      block()
      await waitForResponse(question)
      unblock()
    }
  }, [setMessages, textRef, setControllable, controllableRef])

  const onTextChange = useCallback(
    e => {
      if (!e.target) return
      setText(e.target.value)
      textRef.current = e.target.value
    },
    [setText]
  )

  const chatIconProps = React.useMemo(() => {
    const res = bindTrigger(popupState)
    const superOnClick = res.onClick
    const onClickIcon = async e => {
      superOnClick.call(res, e)

      if (!controllableRef.current) return
      // loading
      const messageObj = {
        loading: true,
      }
      setMessages(prev => [...prev, messageObj])
      block()
      const reply = await chatbot.sayHi()
      messageObj.data = reply
      messageObj.loading = false
      unblock()
      setMessages(prev => [...prev])
    }
    res.onClick = onClickIcon
    return res
  }, [popupState, controllableRef, setControllable])

  return (
    <div>
      <Zoom in={!trigger}>
        <ChatIcon
          className={classes.icon}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...chatIconProps}
        />
      </Zoom>
      <Popover
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
      >
        <Box>
          <Box className={classes.box}>
            <MessageList messages={messages} />
          </Box>
          <Box display="flex" flexDirection="column">
            <textarea
              placeholder="Type message.."
              required
              onChange={onTextChange}
              value={text}
              style={{ margin: "2px" }}
            />
            <Box display="flex" flexDirection="row" justifyContent="flex-end">
              <Button
                size="small"
                variant="contained"
                color="primary"
                style={{ margin: "1px" }}
                onClick={sendMessage}
                disabled={!controllable}
              >
                send
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </div>
  )
}

export default React.memo(Chat)
