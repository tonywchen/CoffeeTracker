import React from 'react';

class DarkModeToggle extends React.Component {
    state = {
        isDark: true
    }

    setDarkMode = (isDark) => {
        if (isDark) {
            document.body.dataset.theme = 'dark';
        } else {
            document.body.dataset.theme = 'light';
        }

        this.setState({
            isDark: !!isDark
        });
    }

    render() {
        let lightClassName = (this.state.isDark)
            ? 'light'
            : 'light selected';

        let darkClassName = (this.state.isDark)
            ? 'dark selected'
            : 'dark';

        return (
            <div>
                <div className={lightClassName} onClick={() => {this.setDarkMode(false)}}>Light</div>
                <div className={darkClassName} onClick={() => {this.setDarkMode(true)}}>Dark</div>
            </div>
        );
    }
}

export default DarkModeToggle;