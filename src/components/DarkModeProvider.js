import React from 'react';
import DarkModeContext from './DarkModeContext';

class DarkModeProvider extends React.Component {
    state = {
        value: true, // not dark mode
    }

    componentDidMount() {
        this.refresh();
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
    
    refresh = () => {
        if (this.state.value) {
            document.body.dataset.theme = 'dark';
        } else {
            document.body.dataset.theme = 'light';
        }
    }

    render() {
        return (
            <DarkModeContext.Provider value={{
                value: this.state.value,
                toggle: this.toggle,
                enable: this.enable,
                disable: this.disable,
                refresh: this.refresh
            }}>
                {this.props.children}
            </DarkModeContext.Provider>
        );
    }
}

export default DarkModeProvider;