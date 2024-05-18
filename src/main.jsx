
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: main for CapyChat client
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import Auth from './components/Auth/Auth.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Auth>
        <App />
    </Auth>
)
