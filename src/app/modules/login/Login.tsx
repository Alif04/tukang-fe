import {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Form, Button} from 'react-bootstrap'
import Swal from 'sweetalert2'
import axios from 'axios'
import {toAbsoluteUrl} from '../../../_metronic/helpers'

export function Login() {
  const navigate = useNavigate()
  const apiUrl = process.env.REACT_APP_API_URL
  console.log('API URL:', apiUrl)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
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
        const userRole = res.data.roles.roles.name

        localStorage.setItem('username', res.data.user.username)
        localStorage.setItem('userRole', userRole)
        localStorage.setItem('accessToken', res.data.accessToken)
        localStorage.setItem('user_id', res.data.user.id)

        if (
          userRole === 'admin store' ||
          userRole === 'admin ho' ||
          userRole === 'admin vendor' ||
          userRole === 'tukang'
        ) {
          navigate('/home')
          Swal.fire({
            title: 'Login Success',
            icon: 'success',
          })
        } else {
          Swal.fire({
            title: 'Login Failed',
            icon: 'error',
          })
        }
      })
      .catch((err) => {
        console.error(err)
        Swal.fire({
          title: err.message,
          icon: 'error',
        })
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
            localStorage.setItem('userRole', 'admin-store')
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
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className='text-center'>
              <Button
                id='kt_sign_in_submit'
                className='btn btn-lg btn-primary w-100 mb-5'
                onClick={performLogin}
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className='d-flex flex-center flex-column-auto p-10'>
        <div className='d-flex align-items-center fw-bold fs-6'>
          <a href='#' className='text-muted text-hover-primary px-2'>
            About
          </a>
          <a href='#' className='text-muted text-hover-primary px-2'>
            Contact
          </a>
          <a href='#' className='text-muted text-hover-primary px-2'>
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
