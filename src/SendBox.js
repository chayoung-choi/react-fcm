import {Button, Card} from "react-bootstrap";
import {useState} from "react";
import axios from "axios";

const SendBox = () => {

  const [responseData, setResponseData] = useState("Response")
  const [notiTitle, setNotiTitle] = useState("Push Test")
  const [notiBody, setNotiBody] = useState("Push 내용입니다.")
  const [notiToken, setNotiToken] = useState(
      process.env.REACT_APP_FCM_DEFAULT_TOKEN)
  const [isInvalid, setIsInvalid] = useState(false)

  const sendPush = () => {
    if (notiToken === "") {
      setIsInvalid(true)
      return
    }

    axios.post('https://fcm.googleapis.com/fcm/send',
        {
          "notification": {
            "title": notiTitle,
            "body": notiBody,
            "click_action": "https://react-fcm-512a3.firebaseapp.com",
            "icon": "/favicon.ico"
          },
          "to": notiToken
        },
        {
          headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'key=' + process.env.REACT_APP_FCM_AUTH_KEY
          }
        }
    )
    .then((response) => {
      console.log(response);
      setResponseData(JSON.stringify(response.data))
    })
    .catch((response) => {
      console.error(response)
      setResponseData(JSON.stringify(response.data))
    });
  }

  return <>
    <Card className="text-dark">
      <Card.Header><h5 className="mb-0">Push 발송하기</h5></Card.Header>
      <Card.Body>
        <div className="form-floating mb-1">
          <input type="email"
                 className={"form-control form-control-sm" + (isInvalid
                     ? " is-invalid" : "")}
                 id="floatingInput1"
                 value={notiToken}
                 onChange={event => {
                   setIsInvalid(false)
                   setNotiToken(event.target.value);
                 }}
                 placeholder="token"/>
          <label htmlFor="floatingInput1">수신자 token</label>
        </div>
        <div className="form-floating mb-1">
          <input type="email" className="form-control form-control-sm"
                 id="floatingInput2"
                 value={notiTitle}
                 onChange={event => setNotiTitle(event.target.value)}
                 placeholder="Push Title"/>
          <label htmlFor="floatingInput2">Title</label>
        </div>
        <div className="form-floating mb-1">
          <input type="email" className="form-control form-control-sm"
                 id="floatingInput3"
                 value={notiBody}
                 onChange={event => setNotiBody(event.target.value)}
                 placeholder="Message"/>
          <label htmlFor="floatingInput3">Message</label>
        </div>
        <Button onClick={sendPush}>발송</Button>
      </Card.Body>
      <Card.Footer>
        {responseData}
        {"{\"multicast_idmulticast_idmulticast_idmulticast_idmulticast_idmulticast_idmulticast_idmulticast_idmulticast_id\":6910996485230823000,\"success\":1,\"failure\":0,\"canonical_ids\":0,\"results\":[{\"message_id\":\"13b876f5-fcc4-428a-bb84-71dd6b942809\"}]}{\"multicast_id\":6910996485230823000,\"success\":1,\"failure\":0,\"canonical_ids\":0,\"results\":[{\"message_id\":\"13b876f5-fcc4-428a-bb84-71dd6b942809\"}]}"}
      </Card.Footer>
    </Card>
  </>
}
export default SendBox
