import React from 'react';
import InitiateForm from './InitiateForm';

class InitiatePage extends React.Component {
    render() {
        document.body.classList.add('background-login');
        return (
            <div className="row">
                <div className="col-md-4 col-md-offset-4">
                    <InitiateForm/>
                </div>
            </div>
        );
    }
}

export default InitiatePage;
