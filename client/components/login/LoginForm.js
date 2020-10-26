import React from 'react';
import {connect} from 'react-redux';
import {login} from '../../actions/userActions';
import classnames from "classnames";


class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: '',
            isLoading: false
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    isValid() {

        return true;
    }

    onSubmit(e) {
        e.preventDefault();
        if (this.isValid()) {
            this.setState({error: '', isLoading: true});
            this.props.login(this.state).then(
                (res) => {
                    if (typeof res !== 'undefined') {
                        this.setState({error: 'Invalid Credentials', isLoading: false});
                    } else {
                        this.context.router.push('/');
                    }
                }
            );
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    onBlur(e) {
        if (e.target.value.trim() !== "")
            $(e.target).addClass('has-val');
        else
            $(e.target).removeClass('has-val');
    }

    render() {
        const {error, email, password, isLoading} = this.state;

        const form = (
            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100">
                        <form className="login100-form validate-form" onSubmit={this.onSubmit}>
                            <span className="login100-form-title p-b-26">ProctoPro Login</span>

                            <div className={classnames('wrap-input100 validate-input ', {'has-error': error})} data-validate="Valid email is: a@b.c">
                                <input className="input100" type="text" name="email" value={email} onBlur={this.onBlur} onChange={this.onChange}/>
                                <span className="focus-input100" data-placeholder="Email"/>
                                {error && <span className="help-block">{error}</span>}
                            </div>

                            <div className={classnames('wrap-input100 validate-input ')} data-validate="Enter password">
                                <input className="input100" type="password" name="password" value={password} onBlur={this.onBlur} onChange={this.onChange}/>
                                <span className="focus-input100" data-placeholder="Password"/>
                            </div>

                            <div className="container-login100-form-btn">
                                <div className="wrap-login100-form-btn">
                                    <div className="login100-form-bgbtn"/>
                                    <button className="login100-form-btn" disabled={isLoading}>Login</button>
                                </div>
                            </div>

                            <div className="text-center p-t-55">
						        <span className="txt1">Don’t have an account?&nbsp;</span>
                                <a className="txt2" href="/signup">Sign Up</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
        return (
            form
        );
    }
}

LoginForm.propTypes = {
    login: React.PropTypes.func.isRequired
}

LoginForm.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect(null, {login})(LoginForm);
