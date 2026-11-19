import React from 'react';import {createRoot} from 'react-dom/client';import {BrowserRouter} from 'react-router-dom';
import App from './App';import {StoreProvider} from './context/Store';import {AuthProvider} from './context/Auth';import {ToastProvider} from './components/ui';import './index.css';
createRoot(document.getElementById('root')).render(<BrowserRouter><AuthProvider><ToastProvider><StoreProvider><App/></StoreProvider></ToastProvider></AuthProvider></BrowserRouter>);
