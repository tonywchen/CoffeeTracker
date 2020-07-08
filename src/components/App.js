import React from 'react';
import { Router, Route, Switch, BrowserRouter } from 'react-router-dom';

import Navbar from './Navbar';
import ProductView from './ProductView';

import '../styles.scss';

class App extends React.Component {
    render() {
        return (
            <div className="ui container">
                <BrowserRouter>
                    <Navbar />
                    <main>
                        <Switch>
                            <Route path="/" key="new" exact render={props => (
                                <ProductView {...props} type="new"/>
                            )} />
                            <Route path="/all" key="all" exact render={props => (
                                <ProductView {...props} type="all"/>
                            )} />
                        </Switch>
                    </main>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;