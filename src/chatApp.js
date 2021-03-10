import React from 'react';

import socketClient from "socket.io-client";
     
const SERVER = "http://127.0.0.1:8080";

function chatApp() {

    var socket = socketClient (SERVER
        // { withCredentials: true,
        //   extraHeaders: {
        //       "sagis": "hello"
        //   }
        // }    
    );
    socket.on('connection', () => {
        console.log(`I'm connected with the back-end`);
    }); 

    return (
        <React.Fragment>
        <p>Im a chat</p>
‍       </React.Fragment>  
    );
}
export default chatApp;