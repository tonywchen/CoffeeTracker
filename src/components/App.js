import React from 'react';
import ProductView from './ProductView';

import '../styles.scss';


class App extends React.Component {
    render() {
        return (
            <main className="ui container">
                <ProductView />
            </main>
        );
    }
}

export default App;