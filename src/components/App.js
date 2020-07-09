import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import Header from './Header';
import ProductView from './ProductView';

import '../styles.scss';

class App extends React.Component {
    render() {
        return (
            <div className="app" data-theme="dark">
                <BrowserRouter>
                    <Header />
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