import React from 'react';
import SignupForm from './SignupForm';

class SignupPage extends React.Component {
  render() {
    document.body.classList.add('background-login');
    return (
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
          <SignupForm/>
        </div>
      </div>
    );
  }
}

export default SignupPage;
