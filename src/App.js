import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from "react";
import {Badge, Button, ButtonGroup, ListGroup} from "react-bootstrap";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {db, getFcmToken, onMessageListener} from "./firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import SendBox from "./SendBox";
import moment from "moment";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [fcmToken, setFcmToken] = useState('');
  const [copyProp, setCopyProp] = useState({value: '', copied: false});
  const [userAgent, setUserAgent] = useState("");
  const [isKakaotalk, setIsKakaotalk] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [tokens, setTokens] = useState([]);

  onMessageListener().then(payload => {
    setNotifications(state => state.concat({
      ...payload.notification,
      date: moment().format('YYYY-MM-DD HH:mm:ss')
    }))
    toast(`${payload.notification.body}`)
    console.log("[App onMessageListener]", payload);
  }).catch(err => console.log('failed: ', err));

  const copy = () => {
    toast("✅ token copied!", {delay: 1000});
    setCopyProp({value: fcmToken, copied: true})
  }

  const addToken = async () => {
    const data = {
      name: "Japan",
      token: fcmToken,
      userAgent: userAgent,
      defaultCheck: false
    }
    const docRef = await addDoc(collection(db, "tokens"), data);

    setTokens(state => state.concat(data))
  }

  const getTokens = async () => {
    const querySnapshot = await getDocs(collection(db, "tokens"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setTokens(state => state.concat(doc.data()))
    });
  }
  useEffect(() => {
    getTokens().then(r => console.log(r))
  }, [])

  useEffect(() => {
    // getFcmToken(setFcmToken);
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
      <>
        <div className="App">
          <nav className="navbar border-bottom border-secondary"
               style={{backgroundColor: "#282c34"}}>
            <div className="container-fluid d-flex justify-content-center">
              <div
                  className="navbar-brand text-white d-flex">
                <img src="/logo192.png" alt="Logo"
                     width="30" height="30"
                     className="App-logo align-self-center"/>
                <div className="d-flex flex-column ">
                  <div>
                    <h5 className="mx-2 mb-0">
                      React FCM APP
                    </h5>
                  </div>
                  <div className="d-flex justify-content-center">
                    <h6 className="m-0">
                      <small>
                        <Badge>v{process.env.REACT_APP_VER}</Badge>
                      </small>
                    </h6>
                  </div>
                </div>
                <img src="/firebase-message.png" alt="Logo"
                     className="align-self-center"
                     height="30"/>
              </div>
            </div>
          </nav>
          <div className="container-fluid p-3">
            <div className="row mb-3">
              <div className="col-12 mb-3 text-center">
                {fcmToken && <h3> Notification permission enabled 👍🏻 </h3>}
                {!fcmToken && <h3> Need notification permission ❗️ <Button onClick={() => getFcmToken(setFcmToken)}>getToken</Button></h3>}
              </div>
              <div className="col-md-6">
                <SendBox tokenList={tokens}/>
              </div>
              <div className="col-md-6">
                {notifications.length > 0 && (
                    <div className="py-3 w-100">
                      <p className="text-start">Push Log</p>
                      <div className="d-flex w-100">
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
                )}
              </div>
            </div>


            <div
                className="d-flex flex-column align-items-center justify-content-center align-content-center">
              <div className="w-50" hidden={fcmToken !== ""}>
                <img src={logo} className="App-logo h-auto w-100"
                     alt="logo"/>
              </div>

              {isKakaotalk &&
                  <Button onClick={openChrome} color="warning">다른 브라우저로
                    열기</Button>
              }
              {isIos && <p>IOS는 다른 브라우저로 열어주세요.</p>}
              {fcmToken &&
                  <>
                    <div className="d-grid">
                      <span className="text-info">Push Token</span>
                          <small>
                            <ButtonGroup>


                      <CopyToClipboard text={copyProp.value || ""}
                                       onCopy={() => copy()}>
                        <Button variant="outline-info"
                                className="text-break"
                                disabled={!fcmToken}>
                            {fcmToken}
                        </Button>
                      </CopyToClipboard>
                      <Button variant="outline-info" onClick={addToken}>
                        💾
                      </Button>
                            </ButtonGroup>
                          </small>
                    </div>
                  </>
              }
              <p className="text-center text-secondary">
                <small>
                  {userAgent}
                </small>
              </p>
            </div>
            <ToastContainer/>
          </div>
        </div>
      </>
  );
}

export default App;
