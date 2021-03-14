import React, { Component } from 'react'
import { Redirect } from "react-router-dom";

import SocketContext  from '../../context/socketContext' 


class Loginpage extends Component {
    //remove the state for name and pwd -only bia server
    state = {
        cmpMounted : true,
        name: '',
        pwd: '',
        authenticated: false,
        wrongcred: false,
        redirect: null
    }
    
    componentDidMount = () => {
        if (!this.state.cmpMounted) {
            return
        } 
        this.setState({
            ...this.state,
            cmpMounted: true
        })

        this.context.socket.on('logintochaterr', (data) => {
            this.setState({
                ...this.state,
                wrongcred: true
            });
            //REMOVE THE MESSAGE AFTER 1 SECOND
            setTimeout(()=> {
                this.setState({...this.state,
                    wrongcred: false
                })
            },5000)
        })

        
        this.context.socket.on('newusercreated', () => {
            this.redirectHandler();
        })

        this.context.socket.on('loginsucces', () => {
            console.log('log succesfull')
            this.redirectHandler()
        })
        
    }

    componentWillUnmount =() => {
        this.setState({
            ...this.state,
            cmpMounted: false
        })
    }

    redirectHandler = () => {
        this.setState({
            ...this.state,
            redirect:  <Redirect to={{ pathname: "/main"}}/>
        });
    }

    NameHandle = (e) => {
        this.setState({
            ...this.state,
            name: e.target.value
        })
    }
    
    pwdhandle = (e) => {
        this.setState({
            ...this.state,
            pwd: e.target.value
        })
    }

    loginHandler =() => {
        // sessionStorage.removeItem('auth')
        this.context.socket.emit('logintochat', {
            name: this.state.name,
            pwd: this.state.pwd
            }
        );
    }
    
    render() {
        return (
            <div className='logBox'>
                {this.state.redirect}
                Welcome commrade
                <br/>
                {this.state.wrongcred ? <div>User Does not exists or wrong password</div> : null}
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
                <button className='signin' onClick={this.loginHandler}>SIGNUP</button>
                <div>test data</div>
                <div>{this.state.authenticated ? 'Logged' : 'Not Logged'}</div>
                <div>{sessionStorage.getItem('auth')}</div>
            </div>
        )
    }
}

Loginpage.contextType = SocketContext;
export default Loginpage;