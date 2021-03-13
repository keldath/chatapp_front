
import React from 'react';
import {BrowserRouter, Switch, Route} from "react-router-dom";

import MainFrame from './components/chatUX/mainframe'
import Loginpage from './components/auth/loginpage'  
import { SocketProvider}  from './context/socketContext' 
   

function App() {

  
  return (
   <React.Fragment>
   <SocketProvider>
      <p>Welcome to this Chat</p>
      <BrowserRouter >
          <Switch>
              <Route path='/login' exact component={Loginpage} ></Route>
              <Route path='/main' exact component={MainFrame} ></Route>
              <Route path='/' component={Loginpage} ></Route>
          </Switch>
      </BrowserRouter>
   </SocketProvider>
   </React.Fragment>  
  );
}

export default App;


