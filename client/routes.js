import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/App';
import SignupPage from './components/signup/SignupPage';
import LoginPage from './components/login/LoginPage';
import InitiatePage from "./components/initiate/InitiatePage";
import ExamPage from "./components/exam/ExamPage";
import requireAuth from './utils/requireAuth';
import requireInit from './utils/requireInit';
import checkifAuth from "./utils/checkifAuth";


export default (
    <Route path="/" component={App}>
        <IndexRoute component={requireInit(ExamPage)}/>
        <Route path="signup" component={checkifAuth(SignupPage)}/>
        <Route path="login" component={checkifAuth(LoginPage)}/>
        <Route path="initiate" component={requireAuth(InitiatePage)}/>
    </Route>
)
