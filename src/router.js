import React from 'react';
import { Router, Switch, Route } from 'dva/router';
import dynamic from 'dva/dynamic';

function RouterConfig({ history, app }) {
    const Homepage = dynamic({
        app, component: () => import('./routes/Homepage'),
    });
    return (
        <Router history={history}>
            <Switch>
                <Route exact path="/" component={Homepage} />
            </Switch>
        </Router>
    );
}

export default RouterConfig;
