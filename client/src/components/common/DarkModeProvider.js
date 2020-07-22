import React from 'react';
import DarkModeContext from './DarkModeContext';

const setAndListenForSystemPreference = (callback) => {
    if (window.matchMedia) {
        let schemaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        callback(schemaQuery.matches);
        schemaQuery.addListener(e => {
            callback(e.matches);
        });
    }
};

class DarkModeProvider extends React.Component {
    state = {
        value: false
    }

    componentDidMount() {
        setAndListenForSystemPreference(this.update)
    }

    toggle = () => {
        if (this.state.value) {
            this.disable();
        } else {
            this.enable();
        }
    }

    enable = () => {
        this.setState({value: true});
        document.body.dataset.theme = 'dark';
    }

    disable = () => {
        this.setState({value: false});
        document.body.dataset.theme = 'light';
    }
    
    update = (newValue) => {
        if (newValue) {
            this.enable();
        } else {
            this.disable();
        }
    }

    render() {
        return (
            <DarkModeContext.Provider value={{
                value: this.state.value,
                toggle: this.toggle,
                enable: this.enable,
                disable: this.disable
            }}>
                {this.props.children}
            </DarkModeContext.Provider>
        );
    }
}

export default DarkModeProvider;