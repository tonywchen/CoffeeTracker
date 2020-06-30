import React from 'react';
import ProductList from './ProductList';

import '../styles.scss';


class App extends React.Component {
    render() {
        return (
            <main className="ui container">
                <ProductList />
            </main>
        );
    }
}

export default App;