import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import Header from './Header';
import DarkModeProvider from './common/DarkModeProvider';
import ProductView from './products/ProductView';

import '../styles.scss';

let VIEWS = [{
    type: 'new',
    path: '/',
    title: 'New Coffee',
    description: 'Here are all the newly-relesed coffee in the past 5 days!'
}, {
    type: 'all',
    path: '/all',
    title: 'All Coffee',
    description: 'Here are all current offerings from the roasters!'
}];


class App extends React.Component {

    render() {
        let routes = VIEWS.map((v) => {
            return (
                <Route path={v.path} key={v.type} title={v.title} exact render={props => (
                    <ProductView {...props} title={v.title} description={v.description} type={v.type} />
                )} />
            )
        });

        return (
            <div className="app">
                <BrowserRouter>
                    <DarkModeProvider>
                        <Header />
                    </DarkModeProvider>
                    <main>
                        <Switch>
                            {routes}
                        </Switch>
                    </main>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;