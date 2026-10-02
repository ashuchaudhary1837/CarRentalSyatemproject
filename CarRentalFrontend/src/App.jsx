import { useState } from 'react'
import './App.css'
import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import Home from './home/Home'
import Login from "./components/Login";
import Register from "./components/Register";
import Admin from "./admin/Admin";
import MyBookings from './components/Mybookings';
import List from './components/List';
import AddCarForm from './components/Usercar';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Routes>

      

                <Route path="/" element={<Login />} />

                <Route path="/login" element={<Login />} />

               <Route path="/my-bookings" element={<MyBookings />}/>

                <Route path="/register" element={<Register />} />

                <Route path="/home" element={<Home />} />

                <Route path="/list" element={<List />} />

                 <Route path= '/admin' element={<Admin/>}   />
                 <Route path='/add-car' element={<AddCarForm />} />


            </Routes>



      {/* Home Page
     <Route path= '/' element={<Home/>}   />
     <Route path= '/adminvalidation' element={<Adminvalidation/>}  />
     <Route path= '/contact' element={<Contact/>}   />
     <Route path= '/about' element={<About/>}   />
     <Route path= '/product' element={<Product/>}   />
    
 */}


    
    </>
  )
}

export default App
