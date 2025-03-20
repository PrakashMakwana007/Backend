import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        avatar: null,
        coverImage: null,
    });

    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.avatar) {
            alert('Avatar is required!');
            return;
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        const result = await dispatch(signupUser(formDataToSend));
        if (signupUser.fulfilled.match(result)) {
            setSuccessMessage('Signup successful! Redirecting...');
            setTimeout(() => navigate('/dashboard'), 2000);
        }
    };

    return (
        <div className=" flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-700 p-6">
            <div className="w-full max-w-2xl bg-gray-900 text-white p-8 rounded-lg shadow-2xl">
                <h2 className="text-3xl font-semibold text-center mb-4">Create an Account</h2>
                <p className="text-center text-gray-400">Sign up to get started with us today.</p>

                {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
                {successMessage && <p className="text-green-400 text-sm text-center mt-2">{successMessage}</p>}

                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                    <div>
                        <label className="block text-gray-300">Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300">Avatar (Required)</label>
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300">Cover Image (Optional)</label>
                        <input
                            type="file"
                            name="coverImage"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-cyan-400 text-gray-900 py-2 rounded-md font-semibold hover:bg-cyan-300 transition duration-300"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center mt-4 text-sm">
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-cyan-400 hover:underline"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Signup;
