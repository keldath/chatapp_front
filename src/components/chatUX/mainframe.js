import { Component, Fragment } from 'react';
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
            ]
        }
    }
    componentDidMount = () => {
        if (!this.cmpMounted) {
            return
        } 
        this.cmpMounted = true;  

       // const socket = React.useContext(UserContext);

        this.context.socket.on('userMsgReceived', (data) => {
            console.log('sagi '+ data)
            this.updateChatState(data)
        })
    }
    componentWillUnmount =() => {
        this.cmpMounted = false;
        this.context.socket.close()//close socket when app is unmounted
        this.context.socket.emit('disconnect');
    }

    msgHandler = (e) => {
        if(!this.cmpMounted)
            return
        this.setState({
            inputmsg: e.target.value
        })
    }

    updateChatState = (msg) => {
        if(!this.cmpMounted)
            return
        const timestamp = Date.now();
        const time = new Intl.DateTimeFormat('en-US', {year: 'numeric', 
                                    day: '2-digit', month: '2-digit',
                                    hour: '2-digit', minute: '2-digit', 
                                    second: '2-digit', hour12: false}).format(timestamp)
         this.setState({
                ...this.state,
                publicchatlog: 
                [...this.state.publicchatlog , 
                    {
                        time: time,
                        txt: msg,
                        user: 'me'
                    }
                ]  
            }
        )
    }

    publicmsghandler = (e) => {
        if(!this.cmpMounted)
            return
        this.context.socket.emit('userMsgReceived', { msg: this.state.inputmsg });
        this.setState({...this.state,inputmsg: ''})
    }

    chatBoxUpdate () {
        return this.state.publicchatlog.map((item,idx)=> {

            if (item.time !== '')
                return (<div key={idx}>
                        <span>{item.user} </span>
                        <span>{item.txt}</span>
                        </div>);
            else
                return null;
        })
    }


    render () {
        return (
            
            <Fragment>
                <div>
                    <div className='chatpublicbox'>
                        {this.chatBoxUpdate()}
                    </div>
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

