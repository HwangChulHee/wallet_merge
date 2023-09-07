import logo from './logo.svg';
import send from './send.png';
import vote from './vote.png';
import stake from './stake.png';
import './App.css';
import './TabLayout.css';
import { useState } from 'react';
import { useEffect } from 'react';


import Home from './pages/Home';
import SearchAccount from './pages/SearchAccount';
import Send from './pages/Send';
import Resource from './pages/Resource'
import Vote from './pages/Vote'
import Header from './components/Header';
import * as ReactDOM from 'react-dom';
import {
  goBack,
  goTo,
  popToTop,
  Link,
  Router,
  getCurrent,
  getComponentStack,
} from 'react-chrome-extension-router';


function Main() {
  const [isExtension, setIsExtension] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [accountInfo, setAccountInfo] = useState({});
  const [tabContents, setTabContents] = useState([[], []]);
  const [Actions, setActions] = useState([]);
  let filteredAction;
  let actions = null;
  let trx_id;
  const [hep_integer, setHep_integer] = useState(0);
  // 0 투표 , 1 NFT, 2 트랜잭션기록
  const tabName = ['NFT', '활동'];


  const getAccountInfo = () => {
    const apiUrl = 'http://221.148.25.234:8989/getAccountInfo';

    // POST 요청에 사용할 데이터
    const data = {
      accountName: 'producer1',
    };

    // POST 요청 보내기
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        setAccountInfo(data);
        HepToInteger(data.account.core_liquid_balance);
        console.log(data);
      })
      .catch(error => {
        console.error('Error posting data:', error);
      });
  };
  const getAccountTransaction = () => {
    const apiUrl = 'http://221.148.25.234:8989/getAccountTransaction';

    // POST 요청에 사용할 데이터
    // nodejs서버에서 datas안에 accountName으로 받음
    const data = {
      datas: {
        accountName: 'producer1' // 실제 데이터 값
      }
    };
    // POST 요청 보내기
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        actions = data.result;
        filltering(actions);
        setActions(filteredAction);
      })
      .catch(error => {
        console.error('Error posting data:', error);
      });

  };
  //같은 트랜잭션아이디인경우 필터링
  function filltering(actions)
  {
    var updatedItems = [];
    for(var i=0;i<actions.length;i++)
    {
      if(trx_id!==actions[i].action_trace.trx_id)
      {
        trx_id=actions[i].action_trace.trx_id;
        updatedItems.push(actions[i]);
      }
      
    }
    filteredAction=updatedItems;
  } 

  function HepToInteger(balance)
  {
    var HepString=balance.slice(0,-4);
    var dot=".";   //문자열에서 소수를 없애고 정수로 바꾸는 과정
    HepString = HepString.replace(dot, "");
    console.log("헵스트링 : " + HepString);
    setHep_integer(parseInt(HepString))
    console.log("헵인티저 : " + hep_integer);
    
  }


  useEffect(() => {
    getAccountInfo();
    getAccountTransaction();
    setIsExtension(window.innerWidth < 600);

  }, []);

  const handleTabClick = (index) => {
    setActiveTab(index);
    getAccountTransaction();
    getAccountInfo();

  };

  const Transactions = () => {
    
    return (

      <div className='out_line'>
        {Actions.slice().reverse().map((action, index) => (
          <div key={index} className='out_line2'>
            {<div className='transaction_tab_item'>
              <div className='transactin_colunm_1'>
                <div>
                  {action.action_trace.act.data.from} {action.action_trace.act.name === 'transfer' ? '→' : ''} {action.action_trace.act.data.to}
                </div>
                <div className='quantity'>
                  {action.action_trace.act.data.quantity}
                </div>
              </div>
              <div className='transactin_colunm_2'>
                <div>
                  {action.block_time}
                </div>

                <div>
                  {action.action_trace.act.data.memo}
                </div>
                <div className='trx_id'>
                  {action.action_trace.trx_id}
                </div>
              </div>
            </div>
            }
            
          </div>
        ))}
      </div>


    );
  };
  function Body() {
    return (
      <div>
        <div className='pk-div'>
          <p className="public-key">&nbsp; EOSdfasdfasdfee fa&nbsp;</p>{/* accountInfo에 공개키는 없음 */}
        </div>

        <div className='balance'>
          {accountInfo.account && (<p>{accountInfo.account.core_liquid_balance}</p>)}

        </div>
        <div className='functionDiv'>
          <div>
            <Link component={SearchAccount} props={{ accountInfo }}>
              <img src={send} className="function" /><h4 className="function-name">전송</h4>
            </Link>
          </div>
          <div>
            <Link component={Resource} props={{ accountInfo,hep_integer }}>
              <img src={stake} className="function" /><h4 className="function-name">리소스</h4>
            </Link>
          </div>
          <Link component={Vote}>
            <img src={vote} className="function" /><h4 className="function-name">투표</h4>
          </Link>
        </div>

        <div className="tab-layout">
          <div className="tab-menu">
            {tabContents.map((content, index) => (
              <div
                key={index}
                className={`tab-item ${activeTab === index ? 'active' : ''}`}
                onClick={() => handleTabClick(index)}
              >
                {tabName[index]}
              </div>
            ))}
          </div>
          <div className="tab-content">
            {tabContents.map((content, index) => (
              <div
                key={index}
                className={`tab-content-item ${activeTab === index ? 'active' : ''}`}
              >
                {/* {content} */}

                {index === 1 && <Transactions />}
              </div>
            ))
            }
          </div>
        </div>


      </div>
    );
  }



  return (



    <div className={isExtension === false ? 'App' : 'App-Extension'}>

      <header className={isExtension === false ? 'App-header' : 'App-header-Extension'}>
        <Header accountName={accountInfo.account && accountInfo.account.account_name} />                  {/* 상단 계정이름 설정창  */}
        {/* <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/pages/SearchAccount" element={<SearchAccount />} />
          <Route path="/pages/Resource" element={<Resource />} />
          <Route path="/pages/Vote" element={<Vote />} />
          <Route path="/pages/Send/:AccountName" element={<Send />} />
        </Routes> */}
        <Router>
          <Body />
        </Router>
      </header>

    </div>

  );
}





export default Main;




