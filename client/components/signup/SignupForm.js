import React from 'react';
import {connect} from "react-redux";
import {userSignupRequest, isUserExists} from '../../actions/userActions';
import classnames from "classnames";

class SignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            errors: {},
            isLoading: false,
            invalid: false
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.checkUserExists = this.checkUserExists.bind(this);
    }

    onChange(e) {
        const field = e.target.name;
        let errors = this.state.errors;
        errors[field] = '';
        this.setState({[e.target.name]: e.target.value, errors});
    }

    isValid() {
        const result = this.state.password === this.state.passwordConfirmation;
        if (!result) {
            let errors = this.state.errors;
            errors.passwordConfirmation = 'Passwords are different';
            this.setState({errors});
        }
        return result;
    }

    onBlur(e) {
        if (e.target.value.trim() !== "")
            $(e.target).addClass('has-val');
        else
            $(e.target).removeClass('has-val');
    }

    checkUserExists(e) {
        const field = e.target.name;
        const val = e.target.value;
        if (e.target.value.trim() !== "")
            $(e.target).addClass('has-val');
        else
            $(e.target).removeClass('has-val');
        if (val !== '') {
            this.props.isUserExists(val).then(res => {
                let errors = this.state.errors;
                let invalid;
                if (res.data.user.hasOwnProperty('email')) {

                    errors[field] = 'A user with this email exists';
                    invalid = true;
                } else {
                    errors[field] = '';
                    invalid = false;
                }
                this.setState({errors, invalid});
            });
        }
    }

    onSubmit(e) {
        e.preventDefault();

        if (this.isValid()) {
            this.setState({errors: {}, isLoading: true});
            this.props.userSignupRequest(this.state).then(
                (res) => {
                    if (typeof res !== 'undefined') {
                        console.log(res.message);
                        const errs = this.state.errors;
                        if (res.message.includes('name')) {
                            errs.name = 'Please enter a valid name';
                        }
                        if (res.message.includes('email')) {
                            errs.email = 'Please enter a valid email';
                        }
                        if (res.message.includes('password')) {
                            errs.password = 'Please enter a valid password';
                        }
                        this.setState({errors: errs, isLoading: false});
                    } else {
                        this.context.router.push('/initiate');
                    }
                },
                (err) => {
                    this.setState({errors: err.response.data, isLoading: false})
                });
        }
    }

    render() {
        const {errors} = this.state;

        const form = (
            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100">
                        <form className="login100-form validate-form" onSubmit={this.onSubmit}>
                            <span className="login100-form-title p-b-26">ProctoPro Register</span>

                            <div className={classnames('wrap-input100 validate-input ', {'has-error': errors.name})} data-validate="Enter your name">
                                <input className="input100" type="text" name="name" value={this.state.name} onBlur={this.onBlur} onChange={this.onChange}/>
                                <span className="focus-input100" data-placeholder="Name"/>
                                {errors.name && <span className="help-block">{errors.name}</span>}
                            </div>

                            <div className={classnames('wrap-input100 validate-input ', {'has-error': errors.email})} data-validate="Valid email is: a@b.c">
                                <input className="input100" type="text" name="email" value={this.state.email} onBlur={this.checkUserExists} onChange={this.onChange}/>
                                <span className="focus-input100" data-placeholder="Email"/>
                                {errors.email && <span className="help-block">{errors.email}</span>}
                            </div>

                            <div className={classnames('wrap-input100 validate-input ', {'has-error': errors.password})} data-validate="Enter password">
                                <input className="input100" type="password" name="password" value={this.state.password} onBlur={this.onBlur} onChange={this.onChange}/>
                                <span className="focus-input100" data-placeholder="Password"/>
                                {errors.password && <span className="help-block">{errors.password}</span>}
                            </div>

                            <div
                                className={classnames('wrap-input100 validate-input ', {'has-error': errors.passwordConfirmation})}
                                data-validate="Enter password">
                                <input className="input100" type="password" name="passwordConfirmation" value={this.state.passwordConfirmation} onBlur={this.onBlur} onChange={this.onChange}/>
                                <span className="focus-input100" data-placeholder="Password Confirmation"/>
                                {errors.passwordConfirmation && <span className="help-block">{errors.passwordConfirmation}</span>}
                            </div>

                            <div className="container-login100-form-btn">
                                <div className="wrap-login100-form-btn">
                                    <div className="login100-form-bgbtn"/>
                                    <button className="login100-form-btn" disabled={this.state.isLoading || this.state.invalid}>Register</button>
                                </div>
                            </div>

                            <div className="text-center p-t-55">
						        <span className="txt1">Have an account?&nbsp;</span>
                                <a className="txt2" href="/login">LogIn</a>
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

SignupForm.propTypes = {
    userSignupRequest: React.PropTypes.func.isRequired,
    isUserExists: React.PropTypes.func.isRequired
}

SignupForm.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect(null, {userSignupRequest, isUserExists})(SignupForm);
