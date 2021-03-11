import { Component, Fragment } from 'react';


/*
 self notes:
 destructuring doesnt work on Edge (...)
 link :
 https://stackoverflow.com/questions/53628191/edge-script1028-expected-identifier-string-or-number
*/
class MainFrame extends Component {

    state = {
        inputmsg: '',
        publicchatlog: [
            {   
                time: '',
                txt: '' ,
                user: ''
            }
        ]
    }

    componentDidMount = () => {
        this.props.socket.on('userMsgReceived', (data) => {
            console.log('sagi '+data)
            this.updateChatState(data)
        })
    }

    msgHandler = (e) => {
        this.setState({
            inputmsg: e.target.value
        })
    }

    updateChatState = (msg) => {
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
        this.setState({...this.state,inputmsg: ''})
        this.props.socket.emit('userMsgReceived', { msg: this.state.inputmsg });
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
                    <label htmlFor='msgbox' >write here
                        <input type='text' name='msgbox' value={this.state.inputmsg} 
                                    onChange={this.msgHandler}/> 
                    </label>
                    <button className='submit' onClick={this.publicmsghandler}>SEND</button>
                </div>
            </Fragment>
        )
    }
}
export default MainFrame;

