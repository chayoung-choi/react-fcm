import {Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";

const SendBox = () => {

  const [responseData, setResponseData] = useState("Response")
  const [notiTitle, setNotiTitle] = useState("Push Test")
  const [notiBody, setNotiBody] = useState("Push 내용입니다.")
  const [inputToken, setInputToken] = useState()
  const [isInvalid, setIsInvalid] = useState(false)
  const [selectedTokenList, setSelectedTokenList] = useState([])

  const tokenList = [{
    name: "갤럭시10",
    value: process.env.REACT_APP_FCM_TOKEN1,
    defaultCheck: true
  }, {
    name: "DK Mac",
    value: process.env.REACT_APP_FCM_TOKEN2,
    defaultCheck: true
  }]

  useEffect(() => {
    setSelectedTokenList(
        tokenList.filter(t => t.defaultCheck).map(t => t.value))
  }, [])

  const sendPush = () => {
    if (inputToken === "" && selectedTokenList.length === 0) {
      setIsInvalid(true)
      return
    }

    if (inputToken !== "") {
      setSelectedTokenList(state => state.concat(inputToken))
    }
    setResponseData([])

    selectedTokenList.map(token => {
      axios.post('https://fcm.googleapis.com/fcm/send',
          {
            "notification": {
              "title": notiTitle,
              "body": notiBody,
              "click_action": "https://react-fcm-512a3.firebaseapp.com",
              "icon": "/favicon.ico"
            },
            "to": token
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
        setResponseData(state => state.concat(JSON.stringify(response.data)))
      })
      .catch((response) => {
        console.error(response)
        setResponseData(state => state.concat(JSON.stringify(response.data)))
      });
    })
  }

  const onChangeCheckBox = ({checked, value}) => {
    if (checked) {
      setSelectedTokenList(state => state.concat(value));
    } else {
      setSelectedTokenList(state => state.filter((v) => v !== value));
    }

  }

  return <>
    <div className="accordion w-100" id="accordionExample">
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button className="accordion-button collapsed" type="button"
                  data-bs-toggle="collapse" data-bs-target="#collapseOne"
                  aria-expanded="false" aria-controls="collapseOne">
            <h5 className="mb-0">Push 발송하기</h5>
          </button>
        </h2>
        <div id="collapseOne" className="accordion-collapse collapse"
             data-bs-parent="#accordionExample">
          <div className="accordion-body">
            <div className="form-floating mb-1">
              <input type="text"
                     className={"form-control form-control-sm" + (isInvalid
                         ? " is-invalid" : "")}
                     id="floatingInput1"
                     value={inputToken}
                     onChange={event => {
                       setIsInvalid(false)
                       setInputToken(event.target.value);
                     }}
                     placeholder="token"/>
              <label htmlFor="floatingInput1">수신자 token</label>
            </div>
            <div>
              <small>
                {tokenList.map((t, i) => (
                    <div className="form-check d-inline-block me-3"
                         key={t.name}>
                      <input className="form-check-input" type="checkbox"
                             value={t.value}
                             defaultChecked={t.defaultCheck}
                          // onChange={e => onChangeCheckBox(
                          //     e.target)}
                             onChange={({
                               target
                             }) => onChangeCheckBox(target)}
                             name="token"
                             id={'check' + i}/>
                      <label className="form-check-label"
                             htmlFor={'check' + i}>
                        {t.name}
                      </label>
                    </div>
                ))}
              </small>
            </div>
            <div className="form-floating mb-1">
              <input type="text" className="form-control form-control-sm"
                     id="floatingInput2"
                     value={notiTitle}
                     onChange={event => setNotiTitle(event.target.value)}
                     placeholder="Push Title"/>
              <label htmlFor="floatingInput2">Title</label>
            </div>
            <div className="form-floating mb-1">
              <input type="text" className="form-control form-control-sm"
                     id="floatingInput3"
                     value={notiBody}
                     onChange={event => setNotiBody(event.target.value)}
                     placeholder="Message"/>
              <label htmlFor="floatingInput3">Message</label>
            </div>
            <div className="d-flex justify-content-end gap-1">
              <Button
                  onClick={sendPush}>발송</Button>
            </div>
            <div className="bg-light border rounded-1 mt-1 p-2 text-break">
              {responseData}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
}
export default SendBox
