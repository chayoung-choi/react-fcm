import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect, useState} from "react";
import {Button, Toast} from "react-bootstrap";
import {getFcmToken, onMessageListener} from "./firebase";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import * as PropTypes from "prop-types";

function Input(props) {
  return null;
}

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.any
};

function App() {

  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({title: '', body: ''});
  const [fcmToken, setFcmToken] = useState(null);


  getFcmToken(setFcmToken);

  onMessageListener().then(payload => {
    setShow(true);
    setNotification({title: payload.notification.title, body: payload.notification.body})
    console.log(payload);
  }).catch(err => console.log('failed: ', err));

  return (
    <div className="App">
      <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide animation style={{
        position: 'absolute',
        top: 20,
        right: 20,
      }}>
        <Toast.Header>
          <img
            src="holder.js/20x20?text=%20"
            className="rounded mr-2"
            alt=""
          />
          <strong className="mr-auto">{notification.title}</strong>
          <small>just now</small>
        </Toast.Header>
        <Toast.Body>{notification.body}</Toast.Body>
      </Toast>
      <header className="App-header">
        {fcmToken && <h1> Notification permission enabled 👍🏻 </h1>}
        {!fcmToken && <h1> Need notification permission ❗️ </h1>}
        <img src={logo} className="App-logo" alt="logo" />
        <code className="p-3">{fcmToken}</code>
        <Button onClick={() => setShow(true)}>Show Toast</Button>
        {/*<div className="d-flex">*/}
        {/*  <input type="text" onChange={(e) => setFcmToken(e.target.value)} value={fcmToken}/>*/}
        {/*  <CopyToClipboard text={fcmToken} onCopy={() => this.setState({copied: true})}>>*/}
        {/*    <Button className="btn-success mt-3">Copy</Button>*/}
        {/*    {this.state.copied ? <span style={{color: 'red'}}>Copied.</span> : null}*/}
        {/*  </CopyToClipboard>*/}
        {/*</div>*/}
      </header>
    </div>
  );
}

export default App;
