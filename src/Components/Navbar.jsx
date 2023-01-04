import React from 'react'
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'


export default function Navbar() {
    let { loginUser, logOut } = useContext(AuthContext)




    return (
        <>
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <NavLink className="navbar-brand" to="">Notes</NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            {loginUser ? <li onClick={logOut}>Logout</li> : <>
                                <li className="nav-item dropdown">
                                    <NavLink className="nav-link text-white dropdown-toggle" to="signin" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Sign In
                                    </NavLink>
                                    <ul className="dropdown-menu">
                                        <li><NavLink className="dropdown-item" to="signup">Sign Up</NavLink></li>
                                        <li><NavLink className="dropdown-item" to="signin">Sign In</NavLink></li>
                                    </ul>
                                </li>
                            </>}

                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

