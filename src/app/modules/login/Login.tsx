import {useState, useEffect} from 'react'
import './Login.css'

import {Link, useNavigate} from 'react-router-dom'
import {Form, Button} from 'react-bootstrap'
import Swal from 'sweetalert2'
import axios from 'axios'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'

export function Login() {
  const navigate = useNavigate()
  const apiUrl = process.env.REACT_APP_API_URL
  console.log('API URL:', apiUrl)

  const [loginData, setLoginData] = useState()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [handleTogglePassword, setHandleTogglePassword] = useState(false)
  const togglePasswordVisiblity = () => {
    setHandleTogglePassword(handleTogglePassword ? false : true)
  }

  const handleLogin = () => {
    setIsLoading(true)
    axios
      .post(
        `${apiUrl}/auth/login`,
        {
          username,
          password,
        },
        {
          headers: {
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )
      .then((res) => {
        if (res.data.statusCode == 200) {
          console.log('Roles:', res.data.roles)

          const userRole: string[] = res.data.roles.map((roles: any) => roles.roles.name)
          console.log('User Role:', userRole)

          localStorage.setItem('user_id', res.data.user.id)
          localStorage.setItem('username', res.data.user.username)
          localStorage.setItem('userRole', userRole.join(','))
          localStorage.setItem('accessToken', res.data.accessToken)

          Swal.fire({
            title: 'Login Success',
            icon: 'success',
          }).then(() => {
            navigate('/home')
          })
          setIsLoading(false)
        } else {
          navigate('/login')
          Swal.fire({
            title: 'Login Failed',
            icon: 'error',
          })
          setIsLoading(true)
        }
      })
      .catch((err) => {
        setIsLoading(false)

        Swal.fire({
          title: 'Login Failed',
          text: err.response.data.message,
          icon: 'error',
        })
        console.error(err)
      })
  }

  const performLogin = async (e: any) => {
    e.preventDefault()

    let successMessage = ''

    try {
      switch (username) {
        case 'adminStore':
          if (password == 'password') {
            localStorage.setItem('username', username)
            localStorage.setItem('userRole', 'admin store')
            successMessage = 'success'
          }
          break

        case 'adminHo':
          if (password == 'password') {
            localStorage.setItem('username', username)
            localStorage.setItem('userRole', 'admin-ho')
            successMessage = 'success'
          }
          break

        case 'adminVendor':
          if (password == 'password') {
            localStorage.setItem('username', username)
            localStorage.setItem('userRole', 'admin-vendor')
            successMessage = 'success'
          }
          break

        case 'tukang':
          if (password == 'password') {
            localStorage.setItem('username', username)
            localStorage.setItem('userRole', 'admin-tukang')
            successMessage = 'success'
          }
          break

        default:
          break
      }

      if (successMessage !== '') {
        Swal.fire({
          title: successMessage,
          icon: 'success',
        })
      } else {
        Swal.fire({
          title: 'Login Failed',
          icon: 'error',
        })
      }

      // navigate('/dashboard')
      document.location.href = '/home'

      // console.log(email)
      // console.log(password)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    localStorage.setItem('kt_theme_mode_menu', 'light')
    localStorage.setItem('kt_theme_mode_value', 'light')
  }, [])

  return (
    <section id='login-page'>
      <div className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'>
        <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
          <a href='#' className='mb-12'>
            <img alt='Logo' src={toAbsoluteUrl('/media/auth/logo-mitra.png')} className='h-100px' />
          </a>
          <div className='w-lg-500px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto'>
            <form className='form w-100'>
              <div className='text-center mb-10'>
                <h1 className='text-dark mb-3'>Sign In to Tukangin Website</h1>
                <div className='text-gray-400 fw-bold fs-4'>
                  New Here?{' '}
                  <Link to='/auth/registration' className='link-primary fw-bolder'>
                    Create an Account
                  </Link>
                </div>
              </div>
              <div className='fv-row mb-10'>
                <Form.Group className='mb-3'>
                  <Form.Label className='fs-6 fw-bolder text-dark'>Username</Form.Label>
                  <Form.Control
                    placeholder='Username'
                    type='text'
                    name='username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className='fv-row mb-10'>
                <Form.Group className='mb-3'>
                  <div className='d-flex justify-content-between mt-n5'>
                    <div className='d-flex flex-stack mb-2'>
                      <Form.Label className='fw-bolder text-dark fs-6 mb-0'>Password</Form.Label>
                      <Link
                        to='/auth/forgot-password'
                        className='link-primary fs-6 fw-bolder'
                        style={{marginLeft: '5px'}}
                      >
                        Forgot Password ?
                      </Link>
                    </div>
                  </div>
                  <Form.Control
                    placeholder='Password'
                    type={handleTogglePassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className='show-hide-password' onClick={togglePasswordVisiblity}>
                    <FontAwesomeIcon
                      icon={handleTogglePassword ? faEye : faEyeSlash}
                      className='text-black'
                      size='lg'
                    />
                  </span>
                </Form.Group>
              </div>
              <div className='text-center'>
                <Button
                  id='kt_sign_in_submit'
                  className='btn btn-lg btn-primary w-100 mb-5'
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging In...' : 'Login'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
