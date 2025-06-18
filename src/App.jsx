import {createBrowserRouter, RouterProvider} from 'react-router';
// import je components
import Layout from './Layout.jsx';
import LoginForm from "../components/LoginForm.jsx";
const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: '/',
                element: <LoginForm/>,
            },
            // {
            //     path: '/create',
            //     element: <CreateProduct/>,
            // },
            //
            // {
            //     path: '/products/:id',
            //     element: <ProductDetail/>,
            // },
        ]
    }
]);

function App() {
    return <RouterProvider router={router}/>;
}

export default App;