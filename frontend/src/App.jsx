import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Layout from './pages/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ResumeBuilder from './pages/ResumeBuilder.jsx'
import Preview from './pages/Preview.jsx'
import Login from './pages/Login.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const router = createBrowserRouter([
  { path: '/', element: <Home/>},

  {path: '/app' , element: <ProtectedRoute><Layout/> </ProtectedRoute> , 
    children: [ 
    {index: true, element: <Dashboard/>},
    { path: "builder/:resumeId", element: <ResumeBuilder /> },
  ]},

  {path: 'view/:resumeId', element: <Preview/>},
  {path: '/auth', element: <Login/>}
])

function App() {
   return (
    <>
    <RouterProvider router = {router}/>
    </>
  )
}

export default App
