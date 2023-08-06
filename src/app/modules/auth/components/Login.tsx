/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Form} from 'react-bootstrap'
import Swal from 'sweetalert2'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const performLogin = async (e: any) => {
    e.preventDefault()

    let successMessage = ''

    try {
      switch (email) {
        case 'adminStore@gmail.com':
          if (password == 'store50') {
            localStorage.setItem('email', email)
            localStorage.setItem('userRole', 'admin-store')
            successMessage = 'success';
          }
          break

        case 'adminHO@gmail.com':
          if (password == 'ho82') {
            localStorage.setItem('email', email)
            localStorage.setItem('userRole', 'admin-ho')
            successMessage = 'success';

          }
          break

        case 'testVendor@gmail.com':
          if (password == 'vendor70') {
            localStorage.setItem('email', email)
            localStorage.setItem('userRole', 'admin-vendor')
            successMessage = 'success';

          }
          break

        case 'testTukang@gmail.com':
          if (password == 'tukang133') {
            localStorage.setItem('email', email)
            localStorage.setItem('userRole', 'admin-tukang')
            successMessage = 'success';

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

      //navigate('/dashboard')
      document.location.href='/dashboard';
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
          <Form.Label className='fs-6 fw-bolder text-dark'>Email address</Form.Label>
          <Form.Control
            placeholder='Email'
            type='email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button
          id='kt_sign_in_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          onClick={performLogin}
        >
          Login
        </button>
      </div>
    </form>
  )
}
