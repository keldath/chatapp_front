import React , {Component} from 'react';
import socketClient from "socket.io-client";
   

const SERVER = "http://127.0.0.1:8080";
const SocketContext = React.createContext();

export const SocketConsumer = SocketContext.Consumer;

export class SocketProvider extends Component {

    socketHandler = () => {
    let socket =  socketClient(SERVER
        // { withCredentials: true,
        //   extraHeaders: {
        //       "sagis": "hello"
        //   }
        // }  
       )
       socket.on('connection', (msg) => {
            console.log(`I'm connected with the back-end`);
            console.log(msg)
       }); 
       socket.on('disconnect', () => {
            console.log(`I'm connected with the back-end`);
            socket.close()
        }); 
        
        return socket;       
    };
    

    render() {
        console.log('socket rendered')
        return (
            <SocketContext.Provider value={{socket: this.socketHandler(),text: 'txt'}}> 
                    {this.props.children}
            </SocketContext.Provider>
                
        )
    }
}

export default SocketContext;