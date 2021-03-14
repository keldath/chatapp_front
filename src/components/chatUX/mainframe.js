import { Component, Fragment } from 'react';

import SocketContext  from '../../context/socketContext' 
import { Redirect } from "react-router-dom";
/*
 self notes:
 destructuring doesnt work on Edge (...)
 link :
 https://stackoverflow.com/questions/53628191/edge-script1028-expected-identifier-string-or-number
*/

/*without this indicator - the component gets an err
 src: https://stackoverflow.com/questions/53949393/cant-perform-a-react-state-update-on-an-unmounted-component
*/

class MainFrame extends Component {
   
    /*without this indicator - the component gets an err
    src: https://stackoverflow.com/questions/53949393/cant-perform-a-react-state-update-on-an-unmounted-component
    */
    constructor(props){
		super(props);
		this.cmpMounted = true;
		this.state = {
        inputmsg: '',
        publicchatlog: [
            {   
                time: '',
                txt: '' ,
                user: ''
            }
        ],
        userList: [],
        redirect: ''
        }
    }
    componentDidMount = () => {
        if (!this.cmpMounted) {
            return
        } 
        this.cmpMounted = true;   

        this.context.socket.emit('updateuserlist',
            (this.context.data.signUser)
        )
        
        this.context.socket.on('updateuserlistall', (data) => {
            this.updateUserlistState(data)
        })

        this.context.socket.on('userMsgReceived', (msg,sender,timestamp) => {
            this.updateChatState(msg,sender,timestamp)
        })
        this.context.socket.emit('displaylastmsg')
        this.context.socket.on('sendlastmsg', (res) => {
         //show last 10 messages
            console.log(res)
            for(let i=0;i< res.length;i++) {
                this.setState({
                    ...this.state,
                    publicchatlog: 
                    [...this.state.publicchatlog , 
                        {
                            time: res[i].createon,
                            txt: res[i].msg,
                            user: res[i].userNick
                        }
                    ]  
                }
                )
            }
        })
    }

    componentWillUnmount =() => {
        //avoid re render issues, clumsy way...
        this.cmpMounted = false;
        this.context.socket.close()//close socket when app is unmounted
        //this.context.socket.emit('disconnect');
        //when closed go back to login
        sessionStorage.removeItem('user')
        this.setState({...this.state, redirect: <Redirect to={{ pathname: "/login"}}/> })
    }

/* handle input start*/ 
    msgHandler = (e) => {
        if(!this.cmpMounted)
            return
        this.setState({
            inputmsg: e.target.value
        })
    }
/* public state updates */
    updateChatState = (msg,sender,timestamp) => {
        if(!this.cmpMounted)
            return
        //update public chat with the new message
         this.setState({
                ...this.state,
                publicchatlog: 
                [...this.state.publicchatlog , 
                    {
                        time: timestamp,
                        txt: msg,
                        user: sender
                    }
                ]  
            }
        )
    }

    updateUserlistState = (data) => {
        if(!this.cmpMounted)
            return
         //update public chat with the new message
         this.setState({...this.state, userList : [...data]})
    }
/* handle input end */ 

    publicmsghandler = (e) => {
        if(!this.cmpMounted)
            return
        this.context.socket.emit('userMsgReceived', { msg: this.state.inputmsg ,sender: this.context.data.signUser});
        this.setState({...this.state,inputmsg: ''})
    }

/*public info update*/ 

    chatBoxUpdateDOM () {
        return this.state.publicchatlog.map((item,idx)=> {

            if (item.time !== '')
                return (<div key={idx}>
                        <span>{item.time} </span>
                        <span>{item.user} </span>
                        <span>{item.txt}</span>
                        </div>);
            else
                return null;
        })
    }

    userListUpdateDOM () {
        let list = this.state.userList;

        if (list === undefined)
            return null;

        if (list.length < 1)
            return null;
        console.log(this.state.userList)
        return this.state.userList.map((item,idx)=> {
                return (<div key={idx}>
                        <span>{item}<br/></span>
                        </div>);
        })
    }

    render () {
        return (
            
            <Fragment>
                {this.state.redirect}
                <div>
                    <div>User Logged: {this.context.data.signUser}</div>
                    <div className='chatpublicbox'>
                        {this.chatBoxUpdateDOM()}
                    </div>
                    <div className='userlist' >{this.userListUpdateDOM()}</div>
                    <label htmlFor='msgbox'>write here: 
                        <input type='text' name='msgbox' value={this.state.inputmsg} 
                                    onChange={this.msgHandler}/> 
                    </label>
                    <button className='submit' onClick={this.publicmsghandler}>SEND</button>
                </div>
            </Fragment>
        )
    }
}

MainFrame.contextType = SocketContext;
export default MainFrame;

