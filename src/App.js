/*global chrome*/
import React, { useState, useEffect } from 'react';
import {
  goBack,
  goTo,
  popToTop,
  Link,
  Router,
  getCurrent,
  getComponentStack,
} from 'react-chrome-extension-router';
import { BrowserRouter, Route,Routes} from 'react-router-dom';

import Welcome from './pages/welcome';
import Header from './pages/header';
import Test from './pages/test'

import PopupComponent from './popup/PopupComponent'
import Sign_request_transaction from './popup/Sign_request_transaction';


const Three = ({message}) => (
  <div onClick={() => popToTop()}>
    <h1>{message}</h1>
    <p>Click me to pop to the top</p>
  </div>
);

const Two = ({message}) => (
  <div>
    This is component Two. I was passed a message:
    <p>{message}</p>
    <button onClick={() => goBack()}>
      Click me to go back to component One
    </button>
    <button onClick={() => goTo(Three, { message })}>
      Click me to go to component Three!
    </button>
  </div>
);

const One = () => {
  return (
    <Link component={Two} props={{ message: 'I came from component one!' }}>
      This is component One. Click me to route to component Two
    </Link>
  );
};


function App() {

  const [request, setRequest] = useState('');
  const [componentsToRender, setComponentsToRender] = useState([]);

  // // 로컬 저장소로부터 상태를 받아온다.
  useEffect(() => {
    
    chrome.storage.local.get(['request_state'], (result) => {
      const storedData = result.request_state; 
      setRequest(storedData);
      
      console.log(storedData)

      if(storedData == "init") {
        let updateData = [];
        updateData.push(<Header />); 
        updateData.push(<Router><Welcome /></Router>);
        setComponentsToRender(updateData);

      } else if(storedData == "dapp_login") {
        let updateData = [];
        updateData.push(<PopupComponent/>);
        setComponentsToRender(updateData);

      } else if(storedData == "dapp_trx") {
        let updateData = [];
        updateData.push(<Sign_request_transaction/>);
        setComponentsToRender(updateData);
      }
      
    });

  }, []);

  
  
  return (
    <>
      {
        componentsToRender
      }      

      {/* <Header/>
      <Router>
        <Welcome/>
      </Router> */}
    </>
  );
}

export default App;
