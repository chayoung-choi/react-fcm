import {Button, Card, Col, InputGroup, Row} from "react-bootstrap";
import {useState} from "react";
import axios from "axios";

const SendBox = () => {

  const [responseData, setResponseData] = useState("응답값")
  const [notiTitle, setNotiTitle] = useState("Push Test")
  const [notiBody, setNotiBody] = useState("Push 내용입니다.")
  const [notiToken, setNotiToken] = useState("")

  const sendPush = () => {
    if (notiToken === "") {
      return
    }

    axios.post('https://fcm.googleapis.com/fcm/send',
      {
        "notification": {
          "title": notiTitle,
          "body": notiBody
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
      <Card.Header className="text-dark">Push 발송하기</Card.Header>
      <Card.Body>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon0">수신자 token</InputGroup.Text>
              <input
                className="form-control"
                placeholder="token"
                aria-label="token"
                aria-describedby="basic-addon0"
                value={notiToken}
                onChange={event => setNotiToken(event.target.value)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">타이틀</InputGroup.Text>
              <input
                className="form-control"
                placeholder="title"
                aria-label="title"
                aria-describedby="basic-addon1"
                value={notiTitle}
                onChange={event => setNotiTitle(event.target.value)}
              />
            </InputGroup>
            <InputGroup className="">
              <InputGroup.Text id="basic-addon2">내용</InputGroup.Text>
              <input
                className="form-control"
                placeholder="body"
                aria-label="body"
                aria-describedby="basic-addon2"
                value={notiBody}
                onChange={event => setNotiBody(event.target.value)}
              />
            </InputGroup>
          </Col>
          <Col className="d-grid gap-3">
            <Button onClick={sendPush}>발송</Button>
            <div className="border p-2">
              <span>{responseData}</span>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </>
}
export default SendBox
