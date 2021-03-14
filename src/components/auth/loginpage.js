import React, { Component } from 'react'
import { Redirect } from "react-router-dom";

import {Button, TextField}  from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';

import { Box } from '@material-ui/core';
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
        
        this.context.socket.on('newusercreated', (user) => {
            this.redirectHandler(user);
        })

        this.context.socket.on('loginsucces', (user) => {
            console.log('log succesfull')
            this.redirectHandler(user)
        })
        
    }

    componentWillUnmount =() => {
        this.setState({
            ...this.state,
            cmpMounted: false
        })
    }

    redirectHandler = (user) => {
        console.log(user)
        sessionStorage.setItem('user', user);
        this.context.changest(user)
        
        //this.context.socket.emit('displaylastmsg')
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
        
        this.context.socket.emit('logintochat', {
            name: this.state.name,
            pwd: this.state.pwd
            }
        );
    }
    
    
    render() {
        return (
            <Container variant='outlined' square='false' style={{ maxWidth: "50vh", margin: 'auto', marginTop: '20vh' }}  className='wrapper' >
                <Grid style={{ backgroundColor: 'white', opacity: 0.9 ,borderRadius:'20px' ,boxShadow:'3px 5px #888888'}} > 
                <Grid container justify="center" > 
                    {this.state.redirect}
                    <Grid item style={{ padding: "5px" }}>
                    <Typography colorSecondary variant="h6" style={{ textDecoration: 'underline' ,  paddingTop: "5px"}}>  Enter Credencials</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={5} justify="center" >
                    <Grid item xs={8} >
                    {this.state.wrongcred ? <Box color="error.main">User Does not exists / wrong password / already connected</Box > : null}
                    <br/>
                    <TextField fullWidth
                            required
                            id="outlined-required"
                            label="Required"
                            //defaultValue="nickname"
                            variant="outlined" 
                            name='nickname' 
                            //value={this.state.name}
                            onChange={this.NameHandle}/> 
                    <br/>
                    <br/>
                    <TextField  fullWidth
                            id="full-width-text-field outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            variant="outlined" 
                            name='password' 
                            //value={this.state.pwd}
                            onChange={this.pwdhandle}/> 
                    <br/>
                    
                </Grid>
                <Grid item  xs={8}>
                        <Button fullWidth variant="contained" color="primary" className='signin' onClick={this.loginHandler}>SIGNUP</Button>
                </Grid>
                </Grid>
                {/* <div>test data</div>
                <div>{this.state.authenticated ? 'Logged' : 'Not Logged'}</div>
                <div>{sessionStorage.getItem('user')}</div> */}
                </Grid> 
            </Container>
        )
    }
}

Loginpage.contextType = SocketContext;
export default Loginpage;

