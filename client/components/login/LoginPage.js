import React from 'react';
import LoginForm from './LoginForm';

class LoginPage extends React.Component {
    render() {
        document.body.classList.add('background-login');
        return (
            <div className="row">
                <div className="col-md-4 col-md-offset-4">
                    <LoginForm/>
                </div>
            </div>
        );
    }
}

export default LoginPage;
