import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

/**import all components */
import Reset from './components/Reset';
import Username from './components/Username';
import Password from './components/Password';

import Profile from './components/Profile';
import Recovery from './components/Recovery';

import PageNotFound from './components/PageNotFound';

import Register from './components/Register';
import { AuthorizeUser, ProtectRoute } from '../middleware/auth';

/**Root routes */
const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Username />
        },

        {
            path: '/register',
            element: <Register />
        },

        {
            path: '/password',
            element: <ProtectRoute><Password /></ProtectRoute>
        },

        {
            path: '/reset',
            element: <Reset />
        },

        {
            path: '/profile',
            element: <AuthorizeUser><Profile /></AuthorizeUser>
        },

        {
            path: '/recovery',
            element: <Recovery />
        },

        {
            path: '*',
            element: <PageNotFound />
        },






    ]

)
export default function App() {
    return (
        <main>
            {/*geeting rid of div and converting into main  */}
            <RouterProvider router={router} />

        </main>
    )
}


