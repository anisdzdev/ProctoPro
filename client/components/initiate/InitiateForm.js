import React from 'react';
import {connect} from 'react-redux';
import {initiate, logout} from '../../actions/userActions';
import {TypingDNA} from '../../tdna/typingdna';
import classnames from "classnames";
import Loading from "react-fullscreen-loading";

class InitiateForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text1: '',
            text2: '',
            text3: '',
            errors: {},
            isLoading: false
        };

        this.tdna1 = new TypingDNA();
        this.tdna2 = new TypingDNA();
        this.tdna3 = new TypingDNA();
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    componentDidMount() {
        this.tdna1.start();
        this.tdna1.addTarget('text1');
        this.tdna2.start();
        this.tdna2.addTarget('text2');
        this.tdna3.start();
        this.tdna3.addTarget('text3');
    }

    componentWillUnmount() {
        this.tdna1.stop();
        this.tdna2.stop();
        this.tdna3.stop();
    }

    isValid() {
        return (this.state['text1'].length > 10 && this.state['text2'].length > 10);
    }

    logout(e) {
        e.preventDefault();
        this.props.logout();
        this.context.router.push('/login');
    }

    reset(e) {
        e.preventDefault();
        this.tdna1.reset();
        this.tdna2.reset();
        this.tdna3.reset();
        this.setState({text1: '', text2: '', text3: ''});
    }

    onBlur(e) {
        if (e.target.value.trim() !== "")
            $(e.target).addClass('has-val');
        else
            $(e.target).removeClass('has-val');
    }

    onSubmit(e) {
        e.preventDefault();
        if (this.isValid()) {
            this.setState({errors: {}, isLoading: true});
            const tp1 = this.getTypingPattern(1);
            const tp2 = this.getTypingPattern(2);
            const tp3 = this.getTypingPattern(3);

            const data = {
                tp_1: tp1,
                tp_2: tp2,
                tp_3: tp3
            }

            this.props.initiate(data).then(
                (res) => this.context.router.push('/'),
                (err) => this.setState({errors: err.response.data.errors, isLoading: false})
            );
        }
    }

    getTypingPattern(i) {
        switch (i) {
            case 1:
                const length_1 = this.state['text1'].length;
                return this.tdna1.getTypingPattern({type: 0, length: length_1});
            case 2:
                const length_2 = this.state['text2'].length;
                return this.tdna2.getTypingPattern({type: 0, length: length_2});
            case 3:
                const length_3 = this.state['text3'].length;
                return this.tdna3.getTypingPattern({type: 0, length: length_3});
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }


    render() {
        const {errors, text1, text2, text3, isLoading} = this.state;

        const form = (
            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100 initiate-form">
                        <form className="login100-form validate-form" autoComplete="off" onSubmit={this.onSubmit}>
                            <span className="login100-form-title p-b-56">Save your typing pattern</span>

                            <div className={classnames('wrap-input100 validate-input initiate-form')}>
                                <textarea className="input200 initiate-form"
                                          rows="10"
                                          id="text1"
                                          name="text1"
                                          value={text1}
                                          onChange={this.onChange}
                                          onBlur={this.onBlur}
                                />
                                <span className="focus-input200 initiate-form" data-placeholder="Type: Posted in 2010, an american survey reports that the elephant is the most appreciated zoo animal."/>
                            </div>

                            <div className={classnames('wrap-input100 validate-input initiate-form')}>
                                <textarea className="input200 initiate-form"
                                          rows="10"
                                          id="text2"
                                          name="text2"
                                          value={text2}
                                          onChange={this.onChange}
                                          onBlur={this.onBlur}
                                />
                                <span className="focus-input200 initiate-form" data-placeholder="Type: When I first saw him, he didn't look like a rich man, but then, what did a rich man look like?"/>
                            </div>

                            <div className={classnames('wrap-input100 validate-input initiate-form last-element')}>
                                <textarea className="input200 initiate-form"
                                          rows="10"
                                          id="text3"
                                          name="text3"
                                          value={text3}
                                          onChange={this.onChange}
                                          onBlur={this.onBlur}
                                />
                                <span className="focus-input200 initiate-form" data-placeholder="Type: Quinn was required to pick up extra classes when an older professor passed away suddenly."/>
                            </div>

                            <div className="container-login100-form-btn">
                                <div className="wrap-login100-form-btn">
                                    <div className="login100-form-bgbtn"/>
                                    <button className="login100-form-btn" disabled={isLoading}>Submit</button>
                                </div>
                            </div>
                            <div className="text-center p-t-45">
						        <span className="txt1">Want to restart?&nbsp;</span>
                                <a className="txt2" href="#" onClick={this.reset.bind(this)}>Reset</a>
                            </div>
                            <div className="text-center p-t-15">
                                <span className="txt1">Cancel?&nbsp;</span>
                                <a className="txt2" href="#" onClick={this.logout.bind(this)}>Logout</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );

        const loader = (
            <Loading loading background="#2ecc71" loaderColor="#3498db"/>
        );
        if (isLoading) {
            return (
                loader
            );
        } else {
            return (
                form
            );
        }
    }
}

InitiateForm.propTypes = {
    initiate: React.PropTypes.func.isRequired,
    logout: React.PropTypes.func.isRequired,
    TypingDNA: React.PropTypes.func.isRequired,
}

InitiateForm.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect(null, {initiate, logout, TypingDNA})(InitiateForm);


