import React from 'react';
import '../App.css';
import logo from '../logo.PNG';
import xbutton from '../xbutton.png';
import goback from '../goback.png';
import { useState } from 'react';
import {
  popToTop,
  Link,
} from 'react-chrome-extension-router';
import StakingTab from '../components/StakingTab';
import UnStakingTab from '../components/UnstakingTab';

const Resource = ({accountInfo,hep_integer}) => {

  var CPU_staking_amount=0;
  var NET_staking_amount=0;
  var CPU_unstaking_amount=0;
  var NET_unstaking_amount=0;


  const [tabContents, setTabContents] = useState([[], []]);
  const [CpuOrRam, setCpuOrRam] = useState(0);
  const [StakingOrUns, setStakingOrUns] = useState(0);
  const [BuyOrSell, setBuyOrSell] = useState(0);
  

  const tabName = ['CPU/NET', 'RAM'];
  const tabName2 = ['스테이킹', '언스테이킹'];
  const tabName3 = ['구매', '판매'];
  const handleTabClick = (index) => {
    setCpuOrRam(index);
  };
  const handleTabClick2 = (index) => {
    setStakingOrUns(index);
  
  };
  const handleTabClick3 = (index) => {
    setBuyOrSell(index);
  
  };

  const RAM_Tab = () => {
    return (
      <div className="tab-layout">
          <div className="tab-menu">
            {tabContents.map((content, index) => (
              <div
                key={index}
                className={`tab-item ${BuyOrSell === index ? 'active' : ''}`}
                onClick={() => handleTabClick3(index)}
              >
                {tabName3[index]}
              </div>
            ))}
          </div>
          <div className="tab-content">
            {tabContents.map((content, index) => (
              <div
                key={index}
                className={`tab-content-item ${BuyOrSell === index ? 'active' : ''}`}
              >
                {index === 0 && <BuyRamTab />}
                {index === 1 && <SellRamTab />}

                
              </div>
            ))
            }
          </div>
        </div>
    );
  };

  function setCPU_staking(amount)
  {
    CPU_staking_amount=amount;
    console.log("received CPU_staking_amount : "+CPU_staking_amount);
  }
  function setRAM_staking(amount)
  {
    NET_staking_amount=amount;
    console.log("received NET_staking_amount : "+NET_staking_amount);
  }
  function setCPU_unstaking(amount)
  {
    CPU_unstaking_amount=amount;
    console.log("received CPU_unstaking_amount : "+CPU_unstaking_amount);
  }
  function setRAM_unstaking(amount)
  {
    NET_unstaking_amount=amount;
    console.log("received NET_unstaking_amount : "+NET_unstaking_amount);
  }



  const CPUNET_Tab = () => {
    return (
      <div className="tab-layout">
          <div className="tab-menu">
            {tabContents.map((content, index) => (
              <div
                key={index}
                className={`tab-item ${StakingOrUns === index ? 'active' : ''}`}
                onClick={() => handleTabClick2(index)}
              >
                {tabName2[index]}
              </div>
            ))}
          </div>
          <div className="tab-content">
            {tabContents.map((content, index) => (
              <div
                key={index}
                className={`tab-content-item ${StakingOrUns === index ? 'active' : ''}`}
              >
                {index === 0 && <StakingTab setCPU_staking={setCPU_staking} setRAM_staking={setRAM_staking} hep_integer={hep_integer} account_name={accountInfo.account.account_name}/>}
                {index === 1 && <UnStakingTab setCPU_unstaking={setCPU_unstaking} setRAM_unstaking={setRAM_unstaking}/>}

                
              </div>
            ))
            }
          </div>
        </div>
    );
  };
  
  

  const SellRamTab=()=>{
    return(
      <div className='StakingTabDiv'>
        <div className='AmountDiv'>
          <input type='number' className='AmountInput' placeholder="Amount of RAM to Sell(HEP)"></input>
          <p className='symbol'>
            HEP
          </p>
        </div>
        <div className='selectPercentDiv'>
          <button className='selectPercentButton'>25%</button><button  className='selectPercentButton'>50%
          </button><button  className='selectPercentButton'>75%</button><button  className='selectPercentButton'>100%</button>
        </div>
        
        
        <div className='bottomDiv'>
        
        <Link className="sendbuttonLink" to="/pages/SearchAccount">
          <button className='sendButton'>
            판매
            {/* 전송하는 함수 만들어서 넣어야 됨. 그리고 결과 보여주고 메인화면으로*/}
          </button>
        </Link>
      </div>
      </div>
    );
  };

  const BuyRamTab=()=>{
    return(
      <div className='StakingTabDiv'>
        <div className='AmountDiv'>
          <input type='number' className='AmountInput' placeholder="Amount of RAM to Buy(HEP)"></input>
          <p className='symbol'>
            HEP
          </p>
        </div>
        <div className='blank'></div>
        
        
        <div className='bottomDiv'>
        
        <Link className="sendbuttonLink" to="/pages/SearchAccount">
          <button className='sendButton'>
            구매
            {/* 전송하는 함수 만들어서 넣어야 됨. 그리고 결과 보여주고 메인화면으로*/}
          </button>
        </Link>
      </div>
      </div>
    );
  };

  
  
  

  const Staking = () => {
    return (
      <div className='stakingDiv'>
        <button className='cancelButton'>
            취소
        </button>
      </div>
    );
  };
  return (
    <div className='resourceDiv'>
      <div className='resourceHeader'>
      <Link to="/pages/SearchAccount">
          <img src={goback} className='gobackbutton' onClick={() => popToTop()}/>
        </Link>
        <font className='myHep'>{accountInfo.account.core_liquid_balance} 보유중</font>
      </div>
        <div className='nowResourcesDiv'>
          <h4 className='resourceCircle'>CPU</h4>
          <h4 className='resourceCircle'>NET</h4>
          <h4 className='resourceCircle'>RAM</h4>
        </div>
        <div className="tab-layout">
          <div className="tab-menu">
            {tabContents.map((content, index) => (
              <div
                key={index}
                className={`tab-item ${CpuOrRam === index ? 'active' : ''}`}
                onClick={() => handleTabClick(index)}
              >
                {tabName[index]}
              </div>
            ))}
          </div>
          <div className="tab-content">
          

        </div>
            {tabContents.map((content, index) => (
              <div
                key={index}
                className={`tab-content-item ${CpuOrRam === index ? 'active' : ''}`}
              >
                {index === 0 && <CPUNET_Tab />}
                {index === 1 && <RAM_Tab />}
                
              </div>
            ))
            }
          
        </div>
    </div>
  );
};


export default Resource;