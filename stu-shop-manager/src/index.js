import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { mainRoutes } from './routes'
import reportWebVitals from './reportWebVitals';
import {HashRouter as Router, Switch, route, Route,Redirect} from 'react-router-dom'
import App from './App'
import 'antd/dist/reset.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
        <Switch>
            <Route path="/admin" render={routeProps =><App {...routeProps} />}/>
            {mainRoutes.map(route => {
                return <Route key={route.path} path={route.path} component={route.component} />
            })}
            <Redirect to="/login" from="/"/>
            <Redirect to="/404" />
        </Switch>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
