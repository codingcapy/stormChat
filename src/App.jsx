
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: app for CapyChat client
 */

import { RouterProvider } from 'react-router-dom';
import { Router } from './router';

function App() {

  const router = Router();

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;
