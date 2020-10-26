import React from 'react';
import {connect} from 'react-redux';

export default function (ComposedComponent) {
    class Authenticate extends React.Component {
        componentWillMount() {
            if (!this.props.isInitiated) {
                this.context.router.push('/initiate');
            }
        }

        componentWillUpdate(nextProps) {
            if (!nextProps.isInitiated) {
                this.context.router.push('/');
            }
        }

        render() {
            return (
                <ComposedComponent {...this.props} />
            );
        }
    }

    Authenticate.propTypes = {
        isInitiated: React.PropTypes.bool.isRequired
    }

    Authenticate.contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    function mapStateToProps(state) {
        return {
            isInitiated: state.auth.isInitiated
        };
    }

    return connect(mapStateToProps)(Authenticate);
}
