import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';



export default function SignIn() {

  const [user, setUser] = useState({ email: '', password: '' });
  const [errorList, setErrorList] = useState([])
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const { getUserToken } = useContext(AuthContext)


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
      setLoading(false)
      setErrorList(validationResult.error.details)
    } else {
      let { data } = await axios.post(`https://route-movies-api.vercel.app/signin`, user);
      if (data.message === 'success') {
        setLoading(false)
        localStorage.setItem('userToken', data.token);
        getUserToken()
        navigate('/')
      } else {
        setLoading(false)
        setErr(data.message)
      }
    }
  }


  function validationInputs() {
    let schema = Joi.object({
      email: Joi.string().email({ tlds: { allow: ['com', 'net'] } }),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
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
                <input type="text" onChange={getUser} className='form-control bg-transparent' name='email' placeholder='Email' />
              </div>
              <div className="groub-input my-2">
                <input type="password" onChange={getUser} className='form-control bg-transparent' name='password' placeholder='Password' />
              </div>
              <button className='btn w-100 btn-light'>
                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
