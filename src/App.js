
import React, { Component } from 'react'
import {BrowserRouter, Switch, Route} from "react-router-dom";

import MainFrame from './components/chatUX/mainframe'
import Loginpage from './components/auth/loginpage'  
import SocketContext, { SocketProvider}  from './context/socketContext' 
 

export default class App extends Component {
 
  /*
    converted to component to use contect or state so the /main routre will
    not be available if no login was done
  */
  // state = {
  //   logged:  this.context.signUser
  //   //sessionStorage.getItem('user');
  // }

  render() {
    return (
      <React.Fragment>
      <SocketProvider>
         <p>Welcome to this Chat</p>
         <BrowserRouter >
             <Switch>
                 <Route path='/login' exact component={Loginpage} ></Route>
                 {/* {this.context.signUser !== '' || this.context.signUser !== undefined ? <Route path='/main' exact component={MainFrame} ></Route> : null}  */}
                 <Route path='/main' exact component={MainFrame} ></Route> 
                 <Route path='/' component={Loginpage} ></Route>
             </Switch>
         </BrowserRouter>
      </SocketProvider>
      </React.Fragment>  
     );
  }
}


App.contextType = SocketContext;


