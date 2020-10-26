import React from 'react';
import {isMobile} from 'react-device-detect';

class App extends React.Component {


    render() {
        if (isMobile) {
            return (
                <div> This content is unavailable on mobile</div>
            )
        }

        return (
            <div className="container">{this.props.children}</div>
        );
    }
}

export default App;
