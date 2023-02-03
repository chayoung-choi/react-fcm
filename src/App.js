import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState} from "react";
import {Button, Toast} from "react-bootstrap";
import {requestPermission} from "./firebase";

function App() {

  const [show, setShow] = useState(false);
  const [isTokenFound, setTokenFound] = useState(false);

  requestPermission();

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
          <strong className="mr-auto">Notification</strong>
          <small>12 mins ago</small>
        </Toast.Header>
        <Toast.Body>There are some new updates that you might love!</Toast.Body>
      </Toast>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <Button onClick={() => setShow(true)}>Show Toast</Button>
      </header>
    </div>
  );
}

export default App;
