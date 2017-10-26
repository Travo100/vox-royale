import React, { Component } from "react";
import openSocket from "socket.io-client";
import { Col, Row, Container } from "../../components/Grid";
import Jumbotron from "../../components/Jumbotron";
import StartBtn from "../../components/StartBtn";
import { Link, withRouter, BrowserRouter, BrowserRouterProps } from "react-router-dom";
import { FormBtn } from "../../components/Form";
import API from "../../utils/API";
import './login.css';

class Login extends Component {
    state = {
        username: "",
        password: "",
        status: "",
        socket: "",
        action: ""
    };

    componentDidMount = () => {

        const socket = openSocket("https://vox-royale-cbc.herokuapp.com/");
        const login = this;

        socket.on("connect", function (data) {
            socket.emit("join", "Hello Server from client id #");
        });

        socket.on("id", function (data) {
            login.setState({ socket: data });
        });
    }


    handleUserSubmit = event => {
        const login = this;
        event.preventDefault();
        API.getUser({
            username: this.state.username,
            password: this.state.password,
            socket: this.state.socket
        })
            .then(function (res) {
                login.setState({ status: res.data });
                if (login.state.status === "username not found") {
                    login.setState({ action: "Username not found. Please, sign up." });

                }
                if (login.state.status === "authenticated") {
                    
                    login.setState({ action: "Enjoy your game!" });
                    console.log("got here!");
                }
                if (login.state.status === "invalid password") {

                    login.setState({ action: "Invalid password. Please, try again" })
                }
            })
            .catch(err => console.log(err));

        // clear out input forms on submit
        this.setState({ username: "", password: "" });
    };




    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };


    render = () => {
        return (
            <Container fluid>

                <Row>
                    <Col size="md-12">
                        <Jumbotron>
                            <div id="title-container">
                                <h1 id="vox-title">VOX<span id="royale-badge">Royale</span></h1>
                            </div>
                            <div id="login-container">
                                <form id="login-form">
                                    <h3>Socket ID: {this.state.socket}</h3>
                                    <label>Username {this.state.username}</label><br />
                                    <input
                                        name="username"
                                        onChange={this.handleInputChange}
                                        value={this.state.username}
                                        placeholder="Username" />
                                    <br /><br />
                                    <label >Password {this.state.password}</label><br />
                                    <input
                                        name="password"
                                        type="password"
                                        onChange={this.handleInputChange}
                                        value={this.state.password}
                                        placeholder="Password" />
                                    <br /><br />
                                    <FormBtn data-toggle="modal" data-target="#exampleModalLong"
                                        disabled={(!this.state.username || !this.state.password)}
                                        onClick={this.handleUserSubmit}>
                                        Login
				    	            </FormBtn>

                                    {/* modal --start */}

                                    <div className="modal fade" id="exampleModalLong" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                                        <div className="modal-dialog" role="document" id="modalDialog">
                                            <div className="modal-content" id="modalContent">
                                                <div className="modal-header">
                                                    <h2 className="modal-title" id="exampleModalLongTitle"> {this.state.action}</h2>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    {this.state.status}
                                                </div>
                                                <div className="modal-footer">
                                                    {this.state.status === "authenticated" ? (
                                                        
                                                        <Link to="/game">
                                                            <StartBtn >
                                                                <i className="fa fa-microphone" aria-hidden="true" ></i> Start
                                                            </StartBtn>
                                                        </Link>
                                                        
                                                    ) : (
                                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* modal --end */}


                                    
                                </form>
                            </div>
                            <div id="sign-up">
                                <Link to="/signup">
                                    Sign up for Vox Royale
                                </Link>
                            </div>
                            <br />
                                <StartBtn>
                                    <i className="fa fa-microphone" aria-hidden="true"></i> Start
                                </StartBtn>
                        </Jumbotron>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(Login);