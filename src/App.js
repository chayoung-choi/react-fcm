import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from "react";
import {Accordion, Badge, Button, ListGroup} from "react-bootstrap";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {getFcmToken, onMessageListener} from "./firebase";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import SendBox from "./SendBox";
import moment from "moment";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [fcmToken, setFcmToken] = useState(null);
  const [copyProp, setCopyProp] = useState({value: '', copied: false});
  const [userAgent, setUserAgent] = useState("");
  const [isKakaotalk, setIsKakaotalk] = useState(false);
  const [isIos, setIsIos] = useState(false);

  onMessageListener().then(payload => {
    setNotifications(state => state.concat({
      ...payload.notification,
      date: moment().format('YYYY-MM-DD HH:mm:ss')
    }))
    toast(`${payload.notification.body}`)
    console.log("[App onMessageListener]", payload);
  }).catch(err => console.log('failed: ', err));

  const copy = () => {
    toast("✅ copied!", {delay: 1000});
    setCopyProp({value: fcmToken, copied: true})
  }

  useEffect(() => {
    getFcmToken(setFcmToken);
  }, [])

  useEffect(() => {
    setCopyProp({value: fcmToken, copied: false})
  }, [fcmToken])

  useEffect(() => {
    const checkUserAgent = navigator.userAgent.toLowerCase()
    if (checkUserAgent.indexOf("kakaotalk") !== -1) {
      setIsKakaotalk(true)
    }
    if (checkUserAgent.indexOf("iphone") !== -1
      || checkUserAgent.indexOf("ipad") !== -1
      || checkUserAgent.indexOf("ipod") !== -1) {
      setIsIos(true)
    }

    setUserAgent(navigator.userAgent)

  }, [])

  const openChrome = () => {
    const url = window.location.href.replace("https://", "")
    window.location.href = `intent://${url}/#Intent;action=android.intent.action.VIEW;scheme=https;end;`
  }

  return (
    <div className="App container-fluid">
      <div className="d-flex flex-column align-items-center justify-content-center align-content-center pt-3">
        <h1>React FCM APP</h1>
        <h6>
          <Badge>v{process.env.REACT_APP_VER}</Badge>
        </h6>
        <img src={logo} className="App-logo" alt="logo"/>
        {fcmToken && <h3> Notification permission enabled 👍🏻 </h3>}
        {!fcmToken && <h3> Need notification permission ❗️ </h3>}
        {isKakaotalk &&
          <Button onClick={openChrome} color="warning">다른 브라우저로 열기</Button>
        }
        {isIos && <p>IOS는 오른쪽 아래 다른 브라우저로 열어주세요.</p>}
        <p></p>
        <p className="text-center">
          {userAgent}
        </p>
        {fcmToken &&
          <>
            <div className="d-flex">
              <Accordion className="text-break">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>View Token</Accordion.Header>
                  <Accordion.Body>
                    {fcmToken}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <CopyToClipboard text={copyProp.value || ""} onCopy={() => copy()}>
                <Button className="btn-success mt-3" disabled={!fcmToken}>Token Copy</Button>
              </CopyToClipboard>
            </div>
            <div className="mt-3">
              <SendBox/>
            </div>
          </>
        }
        <div className="d-flex py-3 w-100">
          <ListGroup as="ol" numbered className="w-100">
            {notifications.map((item, idx) => (
              <ListGroup.Item
                key={idx}
                as="li"
                className="d-flex justify-content-between align-items-start"
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{item.title}</div>
                  {item.body}
                </div>
                <Badge className="sm">{item.date}</Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default App;
