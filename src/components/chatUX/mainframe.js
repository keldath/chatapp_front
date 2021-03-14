import { Component, Fragment } from 'react';
import { Redirect } from "react-router-dom";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import SocketContext  from '../../context/socketContext' 

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

        if(this.context.data.signUser === '') {
            this.setState({...this.state, redirect: <Redirect to={{ pathname: "/login"}}/> })
        }
        else {
            this.context.socket.emit('updateuserlist',
            (this.context.data.signUser))
        }
        
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
    //    this.context.socket.close()//close socket when app is unmounted
        //this.context.socket.emit('disconnect');
        //when closed go back to login
        sessionStorage.removeItem('user')
    //    this.setState({...this.state, redirect: <Redirect to={{ pathname: "/login"}}/> })
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
                <div>User Logged: {this.context.data.signUser}</div>
                <Container variant='outlined' square='false' style={{ minHeight: "84vh",maxHeight: "84vh",  marginTop: '2vh' }}  className='wrapper' >
                 {this.state.redirect}
                 <Grid container>
                    <Grid item justify="center" style={{ minWidth: "82vw" , minHeight: "70vh", maxHeight: "70vh", border: '5px solid white' ,overflowY: 'auto'}}>
                        {this.chatBoxUpdateDOM()}
                    </Grid>
                    <Grid item justify="center" className='userlist' style={{ minWidth: "10vw", border: '5px solid white', borderLeft: '0px' ,overflowY: 'auto'}}>
                        {this.userListUpdateDOM()}
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid container  justify="center" style={{ maxWidth: "92vw"  ,border: '5px solid white', alignContent: 'center'}}>
                    <TextField id="soutlined"
                                   label="Label"
                                   style={{ margin: 8 }}
                                   placeholder="Placeholder"
                                   margin="normal"
                                   InputLabelProps={{
                                     shrink: true,
                                   }}
                                   name='msgbox' 
                                   onChange={this.msgHandler}/> 
                    <Button variant="contained"
                            color="default"
                            style={{margin: 'spacing(1)'}}
                            startIcon={<CloudUploadIcon />}
                            className='submit' onClick={this.publicmsghandler}>SEND</Button>
                    </Grid>
                </Grid>
                </Container>
            </Fragment>
        )
    }
}

MainFrame.contextType = SocketContext;
export default MainFrame;

