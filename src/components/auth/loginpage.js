import React, { Component } from 'react'
import SocketContext  from '../../context/socketContext' 


class Loginpage extends Component {
    //remove the state for name and pwd -only bia server
    state = {
        cmpMounted : true,
        name: '',
        pwd: '',
        authenticated: false
    }
    
    componentDidMount = () => {
        if (!this.state.cmpMounted) {
            return
        } 
        this.setState({
            ...this.state,
            cmpMounted: true
        })

        this.context.socket.on('login', (data) => {
            console.log('authenticated login '+ data)
            
        })
    }

    componentWillUnmount =() => {
        this.setState({
            ...this.state,
            cmpMounted: false
        })
        sessionStorage.removeItem('auth')
    }

    NameHandle = (e) => {
        // this.props.socket
        // e.target.value
        this.setState({
            ...this.state,
            name: e.target.value
        })
    }
    
    pwdhandle = (e) => {
        // this.props.socket
        // e.target.value
        this.setState({
            ...this.state,
            pwd: e.target.value
        })
    }

    signIn = () => {
        //if auth checks out - set true
        console.log(this.state.authenticated)

        this.context.socket.emit('login', {
            name: this.state.name,
            pwd: this.state.pwd
            }
        );

        sessionStorage.setItem('auth', this.state.name);
        this.setState({
            ...this.state,
            authenticated: !this.state.authenticated
        })
    }

    signOut =() => {
        sessionStorage.removeItem('auth')
        this.setState({
            name: '',
            pwd: '',
            authenticated: false
        })
    }
    
    render() {
        return (
            <div className='logBox'>
                Welcome commrade
                <br/>
                <label htmlFor='nickname'>NickName
                        <br/>
                        <input type='text' name='nickname' value={this.state.name}
                                    onChange={this.NameHandle}/> 
                </label>
                <br/>
                <label htmlFor='password'>Password
                        <br/>
                        <input type='text' name='password' value={this.state.pwd}
                                    onChange={this.pwdhandle}/> 
                </label>
                <br/>
                <button className='signin' onClick={this.signIn}>SIGNIN</button>
                <button className='signup' onClick={this.signOut}>SIGNUP</button>
                <div>test data</div>
                <div>{this.state.authenticated ? 'Logged' : 'Not Logged'}</div>
                <div>{sessionStorage.getItem('auth')}</div>
            </div>
        )
    }
}

Loginpage.contextType = SocketContext;
export default Loginpage;