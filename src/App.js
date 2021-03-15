
import React, { Component } from 'react'
import {BrowserRouter, Switch, Route} from "react-router-dom";

import MainFrame from './components/chatUX/mainframe'
import Loginpage from './components/auth/loginpage'  
import SocketContext, { SocketProvider}  from './context/socketContext' 

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';


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
        <CssBaseline />
        <Typography component="div" justify="center" style={{ 
                                                              background: 'linear-gradient(to right, #4ca1af, #c4e0e5)', 
                                                              height: '100vh' }} >
      
         <Typography  style={{ background: 'linear-gradient(to right, rgb(73 153 165), rgb(109 150 154))', 
                                  paddingTop: '10px',
                                  paddingBottom: '5px',
                                  textAlign: 'center' ,
                                  fontSize: '3vh',
                                  fontWeight: 'bold',
                                  textDecoration: 'underline'}}>
                                    Welcome to AnyChat
                                    </Typography>
         <BrowserRouter >
             <Switch>
                 <Route path='/login' exact component={Loginpage} ></Route>
                 {/* {this.context.signUser !== '' || this.context.signUser !== undefined ? <Route path='/main' exact component={MainFrame} ></Route> : null}  */}
                 <Route path='/main' exact component={MainFrame} ></Route> 
                 <Route path='/' component={Loginpage} ></Route>
             </Switch>
         </BrowserRouter>
         </Typography>
      </SocketProvider>
      </React.Fragment>  
     );
  }
}


App.contextType = SocketContext;


