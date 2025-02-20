import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

const Login = () => {
  const { loginUser, googleLogin } = useAuth();
  const loc = useLocation();

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const frm = loc?.state?.from?.pathname || '/';
      const user = await googleLogin();

      if (user) {
        console.log(user);
        // Extract necessary user data
        const userData = {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        };

        try {
          const res = await axios.post('http://localhost:5001/users', userData);
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            navigate(frm, { replace: true });
          }
        } catch (error) {
          toast.error(
            error?.response?.data?.message ||
              'Google login failed. Please try again.'
          );
        }
      }
    } catch (err) {
      toast.error('Google login failed. Please try again.');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='bg-gray-900 text-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>

        {/* Social Login */}
        <div className='mt-6 text-center'>
          <button
            onClick={handleGoogleLogin}
            className='bg-red-600 cursor-pointer w-full hover:bg-red-700 text-white py-2 px-4 rounded'
          >
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
