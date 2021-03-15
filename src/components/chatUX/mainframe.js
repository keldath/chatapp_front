import { Component, Fragment } from 'react';
import { Redirect } from "react-router-dom";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
//import AccessTimeIcon from '@material-ui/icons/AccessTime';

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
       // this.cmpMounted = false;
        this.context.socket.emit('logout',this.context.data.signUser)
        this.context.socket.close()//close socket when app is unmounted
        //when closed go back to login
        sessionStorage.removeItem('user')
        window.location.replace( window.location.origin+"/login");

    //  this.setState({...this.state, redirect: <Redirect to={{ pathname: "/login"}}/> })
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

    msgTimeHandler = (e) => {
        // console.log((document.getElementById(e.target.nextSibling.id)))
        // console.log(document.getElementById(e.target.id))
        //.getElementsByTagName('span').hide()
    }

    chatBoxUpdateDOM () {
        return this.state.publicchatlog.map((item,idx)=> {

            if (item.time !== '')   {
      //        let uniquetime = 'timebtn' + item.time
                return (<div key={idx} style={{ padding: '10px' , color: '#0042d6'}}>
                        {/*wanted to make a button to reveal time stamp - for now removed timestamp  */}
                        {/* <Button id={uniquetime} onClick={this.msgTimeHandler}><AccessTimeIcon/><span id={uniquetime} >{item.time} </span></Button>  */}
                        <span >{item.user}=></span>
                        <span>{item.txt}</span>
                        </div>);
            }
            else {
                return null;
            }
                
        })
    }

    userListUpdateDOM () {
        let list = this.state.userList;

        if (list === undefined)
            return null;

        if (list.length < 1)
            return null;
        return this.state.userList.map((item,idx)=> {
                return (<div key={idx} style={{ padding: '6px' }}>
                        <span >{item}<br/></span>
                        </div>);
        })
    }

    render () {
        const barstyle ={background: 'linear-gradient(to bottom, #4ca1af, #c4e0e5)', color: 'yellow', textAlign: 'center' ,fontSize:'2.5vh' ,justifyContent: "center"}
        const barStyleplus = {fontSize:'1.5vh'} 
        const grids1 = {background: 'linear-gradient(to left, #e0eafc, #cfdef3)'}
        const grids2 =  {background: 'linear-gradient(to left, rgb(224, 234, 252), rgb(174 200 236))'}
        const fonts = {fontWeight: 'bold'}
        return (
            
            <Fragment>
                <Grid  style={{...barstyle, ...barStyleplus}} container>
                Chat away: {this.context.data.signUser} !</Grid>
                <Container variant='outlined' square='false' style={{ minHeight: "84vh",maxHeight: "84vh",  marginTop: '2vh' }}  className='wrapper' >
                 {this.state.redirect}
                 <Grid container>
                     
                    <Grid item style={{ minWidth: "75vw" , minHeight: "70vh", maxHeight: "70vh", border: '5px solid white' ,overflowY: 'auto',...grids1, ...fonts}}>
                        <div style={barstyle}>Chat</div>
                        {this.chatBoxUpdateDOM()}
                    </Grid>
                    <Grid item className='userlist' style={{ minWidth: "17vw", border: '5px solid white', borderLeft: '0px' ,overflowY: 'auto',...grids2,...fonts}}>
                        <div style={barstyle}>Users</div>
                        {this.userListUpdateDOM()}
                    </Grid>
                </Grid>
                <Grid container >
                    <Grid container style={{ maxWidth: "92vw"  ,border: '5px solid white', alignContent: 'center',backgroundColor: '#9fc8ca'}}>
                        <Box  width="80%" className='userlist'>   
                            <TextField id="soutlined"
                                           style={{ margin: 8, width:"70vw" }}
                                           margin="normal"
                                           InputLabelProps={{
                                             shrink: true,
                                           }}
                                           name='msgbox' 
                                           onChange={this.msgHandler}/> 
                        </Box>
                        <Box  width="20%" className='userlist' >              
                            <Button variant="contained"
                                    color="default"
                                    style={{  width:"-webkit-fill-available", height: '5.4vh', justifyContent: 'end'}}
                                    startIcon={<CloudUploadIcon  />}
                                    className='submit' 
                                    onClick={this.publicmsghandler}>SEND</Button>
                        </Box>        
                    </Grid>
                </Grid>
                </Container>
            </Fragment>
        )
    }
}

MainFrame.contextType = SocketContext;
export default MainFrame;

