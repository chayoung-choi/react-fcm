import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from "react";
import {Accordion, Badge, Button, ListGroup} from "react-bootstrap";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {getFcmToken, onMessageListener} from "./firebase";
import {CopyToClipboard} from "react-copy-to-clipboard/src";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [fcmToken, setFcmToken] = useState(null);
  const [copyProp, setCopyProp] = useState({value: '', copied: false});

  onMessageListener().then(payload => {
    setNotifications(state => state.concat({
      ...payload.notification,
    }))
    toast(`${payload.notification.body}`)
    console.log(payload);
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
        <Accordion className="text-break">
          <Accordion.Item eventKey="0">
            <Accordion.Header>View Token</Accordion.Header>
            <Accordion.Body>
              {fcmToken}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <CopyToClipboard text={copyProp.value || ""} onCopy={() => copy()}>
          <Button className="btn-success mt-3">Copy</Button>
        </CopyToClipboard>
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
