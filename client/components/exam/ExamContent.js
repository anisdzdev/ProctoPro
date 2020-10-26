import React from 'react';
import $ from 'jquery';
import Loading from 'react-fullscreen-loading';
import {connect} from 'react-redux';
import {logout} from '../../actions/userActions';
import {loadExam, loadQuestions, submitExam, startExam} from "../../actions/examActions";
import {TypingDNA} from '../../tdna/typingdna';
import classnames from "classnames";
import ExamFields from "../fields/examFields";
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';
import ProgressProvider from "../../utils/ProgressProvider";
import 'react-circular-progressbar/dist/styles.css';

// noinspection JSUnfilteredForInLoop
class ExamContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            exam_id: '',
            startedExam: false,
            finishedExam: false,
            exam_data: {},
            exam_questions: [],
            exam_answers: [],
            id_error: '',
            isLoading: false,
            quit_dialog: false,
            match_percentage: 0,
            match: false,
            cancelled: false,
            initial_quit_timer: 5,
            quit_timer: 5,
            exam_timer: 0,
            isTimed: false,

        };
        this.tdna = new TypingDNA();
        this.tdna.stop();
        this.quit_timer = 0;
        this.exam_timer = 0;
        this.startedTimer = false;
        this.isOut = false;
        this.practice = false;
        this.dark_theme = false;
        this._ismounted = false;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
        this.startQuitTimer = this.startQuitTimer.bind(this);
        this.quitCountDown = this.quitCountDown.bind(this);
        this.onLoadExam = this.onLoadExam.bind(this);
        this.onSubmitExam = this.onSubmitExam.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onChangeID = this.onChangeID.bind(this);
        this.handleAgreeQuit = this.handleAgreeQuit.bind(this);
        this.handleDisagreeQuit = this.handleDisagreeQuit.bind(this);
        this.handleCloseQuit = this.handleCloseQuit.bind(this);
    }

    handleOpenQuit() {
        this.setState({quit_dialog: true});
    }

    handleCloseQuit() {
        this.setState({quit_dialog: false});
    }

    handleAgreeQuit() {
        this.logout();
        this.handleCloseQuit();
    }

    handleDisagreeQuit() {
        this.handleCloseQuit();
    }

    componentDidMount() {
        const exam_id = sessionStorage.getItem('exam_id');
        console.log(exam_id);
        if (exam_id) {
            this.setState({exam_id: exam_id, isLoading: true});
            this.loadExam(exam_id);
        }
        document.addEventListener("mouseleave", () => {
            this.isOut = true;
        });
        document.addEventListener("mouseenter", () => {
            if (this.state['quit_timer'] > 0) {
                this.isOut = false;
            }
        });
        this._ismounted = true;
    }

    componentWillUnmount() {
        this.stopTDNA();
        this._ismounted = false;
    }

    setupTDNA() {
        this.tdna.start();
        const {exam_questions} = this.state;
        for (let i in exam_questions) {
            if (typeof exam_questions[i].monitor != 'undefined') {
                if (exam_questions[i].monitor === true) {
                    this.tdna.addTarget(exam_questions[i].id);
                }
            }
        }
    }

    isValidID() {
        return (this.state['exam_id'].length === 9 && !isNaN(this.state['exam_id']));
    }

    logout() {
        this.props.logout();
        sessionStorage.removeItem('exam_id');
        this.context.router.push('/login');
    }

    stopTDNA() {
        if (this.tdna) {
            this.tdna.stop();
        }
    }

    onLoadExam(e) {
        if (e) {
            e.preventDefault();
        }
        if (this.isValidID()) {
            const id = this.state['exam_id'];
            this.loadExam(id);
        } else {
            this.setState({id_error: 'Please enter a valid ID'});
        }
    }

    loadExam(id) {
        this.setState({isLoading: true});
        this.props.loadExam(id).then(result => {

            if (result['error']) {
                if (result['error'].response.status === 401) {
                    this.setState({id_error: 'Seems like you have already done this exam'});

                } else {
                    this.setState({id_error: 'Not a valid ID'});
                }
                sessionStorage.removeItem('exam_id');
                this.setState({
                    isLoading: false
                });
            } else {
                const file = result['exam_data'].data;
                this.props.loadQuestions(file).then(result2 => {
                    if (result2['error']) {
                        this.setState({id_error: 'Something is wrong with this exam'});
                    } else {
                        const exam_questions = result2['exam_file'];
                        const exam_answers = [];
                        for (let i in exam_questions) {
                            const answer = {
                                id: exam_questions[i].id,
                                question: exam_questions[i].label,
                                answer: '',
                            }
                            exam_answers.push(answer);
                        }
                        const timer = result['exam_data'].time * 60;
                        let isTimed = (timer > 0);
                        this.setState({
                            startedExam: true,
                            isLoading: false,
                            exam_data: result['exam_data'],
                            exam_questions: exam_questions,
                            exam_answers: exam_answers,
                            exam_timer: timer,
                            isTimed: isTimed
                        });
                        if (isTimed) {
                            this.startTimer();
                        }
                        this.startExam(id);
                        if (id !== 100000000) sessionStorage.setItem('exam_id', id);
                        this.setupTDNA();

                    }
                });
            }
        });
    }

    startExam(id) {
        this.props.startExam(id);
        document.oncontextmenu = function (e) {
            e.preventDefault();
            return false;
        }
    }

    onSubmitExam(e) {
        e.preventDefault();
        this.submitExam(false);
    }

    submitExam(cancel) {
        this.setState({isLoading: true});

        const {exam_answers, exam_id} = this.state;

        let json = JSON.stringify(exam_answers);
        let blob = new Blob([json], {type: "octet/stream"});
        let f = new File([blob], "upload.txt");

        let tp = this.getTypingPattern();

        const data = {
            exam_id: exam_id,
            tp: tp,
            cancelled: cancel
        };
        this.props.submitExam(data, f).then(result => {
            if (result['error']) {
                //ERROR
            } else {
                if (!cancel) {
                    console.log(result['response']);
                    let matchingPercent = 0;
                    let match = result['response'].typing_dna_match.match;
                    if (typeof match != 'undefined') {
                        matchingPercent = result['response'].typing_dna_match.matching_percent;
                    }
                    this.setState({
                        finishedExam: true,
                        match: match,
                        match_percentage: matchingPercent
                    });
                }
                this.setState({
                    isLoading: false
                });
                sessionStorage.removeItem('exam_id');
                this.stopTDNA();
            }
        });
    }

    getTypingPattern() {
        let length = 0;
        const {exam_answers, exam_questions} = this.state;
        for (let i in exam_answers) {
            if (exam_questions[i].monitor === true) {
                length += exam_answers[i].answer.length;
            }
        }
        return this.tdna.getTypingPattern({type: 0, length: length});
    }

    onChangeID(e) {
        this.setState({exam_id: e.target.value, id_error: ''});
    }

    onChange(e) {
        const {exam_answers} = {...this.state};
        const currentState = exam_answers;
        const {name, value} = e.target;
        const id = name.slice(15);
        currentState[id].answer = value;
        this.setState({exam_answers: currentState});
    }

    onBlur(e) {
        if (e.target.value.trim() !== "")
            $(e.target).addClass('has-val');
        else
            $(e.target).removeClass('has-val');
    }

    startQuitTimer() {
        if (this.state.quit_timer > 0 && !this.state.cancelled && !this.startedTimer && !this.state.isLoading && !this.state.finishedExam) {
            this.quit_timer = setInterval(this.quitCountDown, 1000);
            this.startedTimer = true;
        }
    }

    stopQuitTimer() {
        if (this.startedTimer) {
            clearInterval(this.quit_timer);
            this.startedTimer = false;
        }
    }

    quitCountDown() {
        let seconds = this.state.quit_timer - 1;

        let cancelled = false;
        if (seconds <= 0) {
            this.stopQuitTimer();
            this.submitExam(true);
            cancelled = true;
            seconds = 0;
        }
        console.log(seconds + " seconds remaining");
        if (this._ismounted) {
            this.setState({
                quit_timer: seconds,
                cancelled: cancelled
            });
        }
    }

    startTimer() {
        if (this.state.exam_timer > 0 && !this.state.cancelled) {
            this.exam_timer = setInterval(this.countDown, 1000);
        }
    }

    countDown() {
        let seconds = this.state.exam_timer - 1;

        if (seconds <= 0) {
            clearInterval(this.exam_timer);
            this.submitExam(false);
            seconds = 0;
        }
        if (this._ismounted) {
            this.setState({
                exam_timer: seconds,
            });
        }
    }

    practiceMode() {
        this.practice = true;
        this.setState({exam_id: 100000000});
        this.loadExam(100000000);
    }

    toggleTheme() {
        this.dark_theme = !this.dark_theme;
    }


    render() {
        const {id_error, startedExam, finishedExam, exam_id, isLoading, exam_answers, exam_questions, exam_data, quit_dialog, match_percentage, match, initial_quit_timer, quit_timer, cancelled, exam_timer, isTimed} = this.state;

        const all_questions = [];
        if (startedExam && !finishedExam) {
            if (cancelled) {
                this.stopQuitTimer();
            } else {
                if (this.isOut) {
                    this.startQuitTimer();
                } else {
                    this.stopQuitTimer();
                }
            }
        }
        for (let i in exam_questions) {
            if (exam_questions[i].type === "multi") {
                const question = (
                    <ExamFields
                        i={i}
                        key={exam_questions[i].id}
                        id={exam_questions[i].id}
                        type={exam_questions[i].type}
                        label={exam_questions[i].label}
                        value={exam_answers[i].answer}
                        choices={exam_questions[i].choices}
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                        name={"exam_questions." + i}
                        isDark={this.dark_theme}
                    />
                );
                all_questions.push(question);
            } else {
                const question = (
                    <ExamFields
                        i={i}
                        key={exam_questions[i].id}
                        id={exam_questions[i].id}
                        type={exam_questions[i].type}
                        label={exam_questions[i].label}
                        value={exam_answers[i].answer}
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                        name={"exam_questions." + i}
                        isDark={this.dark_theme}
                    />
                );
                all_questions.push(question);
            }
        }
        const minutes = Math.floor(exam_timer / 60);
        let seconds = exam_timer % 60;
        if(seconds<10){
            seconds = '0' + seconds;
        }
        let counter_color;
        if (minutes === 0) {
            counter_color = 'red';
        } else if (this.dark_theme) {
            counter_color = '#dddddd';
        }

        const alert_end_exam = (
            <div className={classnames('cd-popup ', {'is-visible': quit_dialog})} role="alert">
                <div className="cd-popup-container">
                    <p>Are you sure you want to quit the exam?</p>
                    <ul className="cd-buttons">
                        <li><a onClick={this.handleAgreeQuit}>Yes</a></li>
                        <li><a onClick={this.handleDisagreeQuit}>No</a></li>
                    </ul>
                    <a onClick={this.handleCloseQuit} className="cd-popup-close img-replace">Close</a>
                </div>
            </div>
        );

        const alert_mouse_left = (
            <div className={classnames('cd-popup ', {'is-visible': this.startedTimer})} role="alert">
                <div className="cd-popup-container">
                    <p>Your mouse has left the window, you have {quit_timer} seconds to bring it back.</p>
                </div>
            </div>
        );

        const exam_id_form = (
            <div className="col-md-4 col-md-offset-4">
                <div className="limiter">
                    <div className="container-login100">
                        <div className="wrap-login100">
                            <form className="login100-form validate-form" autoComplete="off" onSubmit={this.onLoadExam}>
                                <span className="login100-form-title p-b-26">Enter Exam ID</span>
                                <div className={classnames('wrap-input100 validate-input ', {'has-error': id_error})}>
                                    <input className="input100" type="text" id="exam_id" name="exam_id" value={exam_id} onChange={this.onChangeID} onBlur={this.onBlur}/>
                                    <span className="focus-input100" data-placeholder="The exam id here... (ex 123456789)"/>
                                    {id_error && <span className="help-block">{id_error}</span>}
                                </div>


                                <div className="container-login100-form-btn">
                                    <div className="wrap-login100-form-btn">
                                        <div className="login100-form-bgbtn"/>
                                        <button className="login100-form-btn" disabled={isLoading}>Start</button>
                                    </div>
                                </div>
                                <div className="text-center p-t-45">
                                    <span className="txt1">Not sure how it works?&nbsp;</span>
                                    <a className="txt2" href="#" onClick={this.practiceMode.bind(this)}>Enter practice mode</a>
                                </div>
                                <div className="text-center p-t-25">
                                    <span className="txt1">Cancel?&nbsp;</span>
                                    <a className="txt2" href="#" onClick={this.logout.bind(this)}>Logout</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );

        const exam_form = (
            <div style={{width: "100%"}}>
                <div className="limiter">
                    <div className="container-exam100" style={{background: (this.dark_theme) && '#383838'}}>
                        <a className={classnames('float', {'dark': this.dark_theme})} href="#" onClick={this.toggleTheme.bind(this)}><i className="fa fa-paint-brush my-float"/></a>
                        <div className="label-container"><div className="label-text">Toggle theme</div><i className="fa fa-play label-arrow"/></div>

                        <div className="wrap-exam100" style={{background: (this.dark_theme) && '#282828'}}>
                            <form className="login100-form validate-form" autoComplete="off" onSubmit={this.onSubmitExam}>
                                <span className="login100-form-title p-b-55 p-t-35" style={{color: (this.dark_theme) && '#dddddd'}}>{exam_data.title}</span>
                                {isTimed && <span className="login100-form-title p-b-55" style={{color: counter_color}}>{minutes}:{seconds}</span>}

                                {all_questions}

                                <div className="container-login100-form-btn">
                                    <div className="wrap-login100-form-btn">
                                        <div className="login100-form-bgbtn"/>
                                        <button className="login100-form-btn" disabled={isLoading}>Submit</button>
                                    </div>
                                </div>
                                <div className="text-center p-t-45">
						            <span className="txt1">Cancel?&nbsp;</span>
                                    <a className="txt2" href="#" onClick={this.handleOpenQuit.bind(this)}>Quit</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {alert_end_exam}
                {alert_mouse_left}
            </div>
        );

        const loader = (
            <Loading loading background="#2ecc71" loaderColor="#3498db"/>
        );

        const final_screen = (
            <div style={{
                width: "100vw",
                height: "100vh",
                position: "absolute",
                textAlign: "center",
                top: "0",
                bottom: "0",
                background: (match ? "#2ecc71" : "#cc2e2e"),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <h1 style={{
                    position: "absolute",
                    top: "50px",
                    color: "white",
                    fontWeight: "700",
                }}>Exam Submitted !</h1>
                <ProgressProvider valueStart={0} valueEnd={match_percentage}>
                    {percentage => (
                        <CircularProgressbar
                            style={{width: 10 + '%'}}
                            value={percentage}
                            text={`${percentage}% Match`}
                            styles={buildStyles({
                                pathTransitionDuration: .8,
                                textColor: '#fff',
                                textSize: '15px',
                                trailColor: `rgba(255, 255, 255, 0.5)`,
                                pathColor: `rgba(${((255 / 100) * percentage)},255,255,1)`,
                            })}
                        />
                    )}
                </ProgressProvider>
            </div>
        );

        const final_screen_cancelled = (
            <div style={{
                width: "100vw",
                height: "100vh",
                position: "absolute",
                textAlign: "center",
                top: "0",
                bottom: "0",
                background: "#cc2e2e",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <h1 style={{color: "white"}}>This attempt has been cancelled because your mouse left the exam page for more than {initial_quit_timer} seconds. <br/>What you did up to now has been submitted.</h1>
            </div>
        );


        if (isLoading) {
            return (
                loader
            );
        } else if (finishedExam) {
            return (
                final_screen
            );
        } else if (cancelled) {
            return (
                final_screen_cancelled
            );
        } else {
            if (startedExam) {
                document.body.classList.remove('background-login');
                return (
                    exam_form
                );
            } else {
                document.body.classList.add('background-login');
                return (
                    exam_id_form
                )
            }
        }

    }


}

ExamContent.propTypes = {
    loadExam: React.PropTypes.func.isRequired,
    submitExam: React.PropTypes.func.isRequired,
    startExam: React.PropTypes.func.isRequired,
    loadQuestions: React.PropTypes.func.isRequired,
    logout: React.PropTypes.func.isRequired,
    TypingDNA: React.PropTypes.func.isRequired
}

ExamContent.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect(null, {loadExam, submitExam, startExam, loadQuestions, logout, TypingDNA})(ExamContent);


