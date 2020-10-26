import React from 'react';
import classnames from 'classnames';


const ExamFields = ({i, id, value, label, choices, type, name, onChange, isDark, onBlur}) => {
    if (type === "short") {
        return (
            <div className={classnames('wrap-input100-exam validate-input ')}
                 style={{'marginTop': (i === '0') && (20 + 'px')}}>
                <input className='input100-exam'
                       type="text"
                       id={id}
                       name={name}
                       value={value}
                       onChange={onChange}
                       onBlur={onBlur}
                       style={{color: isDark && '#c8c8c8'}}
                />
                <span className="focus-input100-exam" data-placeholder={label}/>
            </div>
        );
    } else if (type === "development") {
        return (
            <div className={classnames('wrap-input100-exam validate-input ')}>
               <textarea className="input200"
                         rows="10"
                         id={id}
                         name={name}
                         value={value}
                         onChange={onChange}
                         onBlur={onBlur}
                         style={{color: isDark && '#c8c8c8'}}
               />
                <span className="focus-input200" data-placeholder={label}/>
            </div>
        );
    } else if (type === "multi") {
        const allRadios = [];

        for (var i = 0; i < choices.length; i++) {
            const radioOption = (
                <label key={choices[i].title}>
                    <input
                        type="radio"
                        id={choices[i].title}
                        name={name}
                        value={choices[i].title}
                        onChange={onChange}/>
                    <span className="radio"/>
                    <span className="label">{choices[i].title}</span>
                </label>
            );
            allRadios.push(radioOption);
        }

        return (
            <div className="bulgy-radios" role="radiogroup" aria-labelledby="bulgy-radios-label"
                 style={{background: isDark && '#282828'}}>
                <h4 id="bulgy-radios-label">{label}</h4>
                {allRadios}
            </div>
        );
    }
}

ExamFields.propTypes = {
    i: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    choices: React.PropTypes.array,
    type: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    isDark: React.PropTypes.bool.isRequired,
    onBlur: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
}


export default ExamFields;
