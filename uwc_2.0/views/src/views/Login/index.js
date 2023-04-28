import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import {React, useState} from "react";
import { useNavigate } from "react-router-dom";
import './styles/loginForm.css';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
//a
export default function Login() {
    const navigate = useNavigate();
    const projectID = '2ddf57c8-852d-4a09-a337-14fb01d1458a';

    const [inputs, setInputs] = useState({});
    const [error, setError] = useState();

    const handleChange = (event) => {
        setInputs((values) => ({...values, [event.target.name]: event.target.value}));
    }

    const handleSubmit = async(event) => {

        event.preventDefault();

        const authObject = { 'Project-ID': projectID, 'User-Name': inputs.login_username, 'User-Secret': inputs.login_password };

        try {
        await axios.get('https://api.chatengine.io/chats', { headers: authObject });

        // const sessionID = uuid();
        // if(sessionStorage.getItem(inputs.login_username))
        // {
        //     console.log("session already assign for: ", inputs.login_username, sessionID )
        // }
        // else sessionStorage.setItem(inputs.login_username, sessionID);
        localStorage.setItem('username', inputs.login_username);
        localStorage.setItem('password', inputs.login_password);

        console.log('info: ', inputs.login_username,' ', inputs.login_password);
        navigate('/');
        setError('');
        } catch (err) {
        setError('Please Recheck user name and password!!');
        }
    }

    return (
        <section className="bg-gray-50 -gray-900 place-items-center bg-login" style={{height: '100vh'}}>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 -gray-800 -gray-700"   style={{width: '550px', marginTop: '140px'}}>
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl -white" style={{textAlign:'center'}}>
                        Sign In
                    </h1>
                    <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 -white">Your Username</label>
                            <input
                                type="text"
                                name="login_username"
                                id="userName"
                                onChange={(e) => {handleChange(e)}}
                                value = {inputs.login_username || ""}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 -gray-700 -gray-600 -gray-400 -white :ring-blue-500 :border-blue-500"
                                placeholder="User Name / User Identification" required=""/>
                        </div>
                        <div>
                            <label
                                className="block mb-2 text-sm font-medium text-gray-900 -white">Password</label>
                            <input
                                type="password"
                                name="login_password"
                                id="password"
                                placeholder="••••••••"
                                onChange={(e) => {handleChange(e)}}
                                value = {inputs.login_password || ""}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 -gray-700 -gray-600 -gray-400 -white :ring-blue-500 :border-blue-500" required=""/>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 -gray-700 -gray-600 :ring-primary-600 -offset-gray-800" required=""/>
                                </div>
                                <div className="ml-3 text-sm">
                                    <label className="text-gray-500 -gray-300">Remember me</label>
                                </div>
                            </div>
                            <a href="#" className="text-sm font-medium text-primary-600 hover:underline -primary-500">Forgot password?</a>
                        </div>
                        <button
                            type="submit"
                            className="w-full text-dark bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center -primary-600 :bg-primary-700 :ring-primary-800"
                            onSubmit={handleSubmit}
                        >

                            Sign in
                        </button>
                        <p className="text-sm font-light text-gray-500 -gray-400">
                            Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline -primary-500">Sign up</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
        </section>
    );
}