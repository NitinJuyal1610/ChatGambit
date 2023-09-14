import React from 'react';
import { Outlet, ReactLocation, Router } from '@tanstack/react-location';
import Login, { loader as loginLoader } from './layouts/login.layout';
import Chat, { loader as chatLoader } from './layouts/chat.layout';

const location = new ReactLocation();

export const AppRouter = () => {
  return (
    <Router
      location={location}
      routes={[
        {
          path: '/',
          element: <Login />,
          loader: async () => await loginLoader(),
        },
        {
          path: 'chat',
          element: <Chat />,
          loader: async () => await chatLoader(),
        },
      ]}
    >
      <Outlet />
    </Router>
  );
};
