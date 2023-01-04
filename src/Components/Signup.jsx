import axios from 'axios';
import Joi from 'joi';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';



export default function SignUp() {
  const [user, setUser] = useState({ first_name: '', last_name: '', email: '', password: '', age: 0 });
  const [errorList, setErrorList] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  function getUser(e) {
    let myUser = { ...user };
    myUser[e.target.name] = e.target.value;
    setUser(myUser)
  }


  async function sendData(e) {
    e.preventDefault();
    setLoading(true)
    let validationResult = validationInputs();
    if (validationResult.error) {
      setErrorList(validationResult.error.details)
      setLoading(false)
    } else {
      let { data } = await axios.post(`https://route-movies-api.vercel.app/signup`, user);
      if (data.message === 'success') {
        setLoading(false)
        navigate('/signin')
      } else {
        setLoading(false)
        setErr(data.message)
      }
    }
  }


  function validationInputs() {
    let schema = Joi.object({
      first_name: Joi.string().min(3).max(9).required(),
      last_name: Joi.string().min(3).max(9).required(),
      email: Joi.string().email({ tlds: { allow: ['com', 'net'] } }),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
      age: Joi.number().min(16).max(80).required()
    })
    return schema.validate(user, { abortEarly: false });
  }

  return (
    <>
      <div className="row">
        <div className="col-md-7 mx-auto">
          <form onSubmit={sendData}>
            <div className="sign">
              {err && <div className='alert alert-danger p-2'>{err}</div>}
              {errorList.map((error, index) => <div key={index} className='alert alert-danger p-2'>{error.message}</div>)}
              <div className="groub-input my-2">
                <input type="text" onChange={getUser} className='form-control bg-transparent' name='first_name' placeholder='First Name' />
              </div>
              <div className="groub-input my-2">
                <input type="text" onChange={getUser} className='form-control bg-transparent' name='last_name' placeholder='Last Name' />
              </div>
              <div className="groub-input my-2">
                <input type="text" onChange={getUser} className='form-control bg-transparent' name='email' placeholder='Email' />
              </div>
              <div className="groub-input my-2">
                <input type="password" onChange={getUser} className='form-control bg-transparent' name='password' placeholder='Password' />
              </div>
              <div className="groub-input my-2">
                <input type="number" onChange={getUser} className='form-control bg-transparent' name='age' placeholder='Age' />
              </div>
              <button className='btn w-100 btn-light'>{loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Sign Up'}</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
