import React from 'react';
import socketClient from "socket.io-client";

import MainFrame from './components/chatUX/mainframe'
     
const SERVER = "http://127.0.0.1:8080";

function chatApp() {

    var socket = socketClient(SERVER
        // { withCredentials: true,
        //   extraHeaders: {
        //       "sagis": "hello"
        //   }
        // }    
    );
    socket.on('connection', (msg) => {
       console.log(`I'm connected with the back-end`);
       console.log(msg)
    });   

    return (
        <React.Fragment>
            <p>Im a chat</p>
            <MainFrame socket={socket}/>
‍       </React.Fragment>  
    );
}
export default chatApp;