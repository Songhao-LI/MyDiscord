import React, {useState} from "react";
import { IoCloseOutline } from "react-icons/io5";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, clearUser } from "../../../redux/actions/userActions";

// eslint-disable-next-line react/prop-types
const Login = ({ loginPopup, handleLoginPopup, handleRegisterPopup }) => {
    const [check, setCheck] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const user = useSelector(state => state.user.currentUser);

    const clickCheckBox = () => {
        setCheck(!check);
    };
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const loginNow = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/login');
            console.log('Login successful:', response.data);
        } catch (error) {
            if (error.response) {
                console.error('Login failed:', error.response.data);
            } else if (error.request) {
                console.error('No response:', error.request);
            } else {
                console.error('Error:', error.message);
            }
        }
    };
    const googleLogin = () => {
        console.log('Google')
    }

    const createAccount = () => {
        // create an account
        handleLoginPopup()
        handleRegisterPopup()
    }

    const forgetPassword = () => {
        // forgetPassword
    }

    return (
        <>
            {loginPopup && (
                <div>
                    <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm">
                        <div
                            className="w-[500px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 rounded-xl">
                            {/* Header secton */}
                            <div className="flex items-center flex-row-reverse">
                                <div>
                                    <IoCloseOutline
                                        onClick={handleLoginPopup}
                                        className="text-2xl cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* main secton */}
                            <div className="container flex flex-col mx-auto rounded-lg pt-12">
                                <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
                                    <div className="flex items-center justify-center w-full lg:p-12">
                                        <div className="flex items-center xl:p-10">
                                            <form
                                                className="flex flex-col w-full h-full pb-6 text-center rounded-3xl">
                                                <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">
                                                    Sign In
                                                </h3>
                                                <p className="mb-4 text-slate-400">Enter your email and password</p>
                                                <a onClick={googleLogin}
                                                    className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-green-200 dark:bg-slate-700 hover:bg-grey-400 focus:ring-4 focus:ring-grey-300">
                                                    <img className="h-5 mr-2"
                                                         src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png"
                                                         alt=""/>
                                                    Sign in with Google
                                                </a>
                                                <div className="flex items-center mb-3">
                                                    <hr className="h-0 border-b border-solid border-grey-500 grow"/>
                                                    <p className="mx-4 text-grey-600">or</p>
                                                    <hr className="h-0 border-b border-solid border-grey-500 grow"/>
                                                </div>
                                                <label htmlFor="email"
                                                       className="mb-2 text-sm text-start text-grey-900">Email*</label>
                                                <input id="email" type="email" placeholder="example@gmail.com" value={email} onChange={handleEmailChange}
                                                       className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-800 mb-7 placeholder:text-grey-700 bg-gray-200 dark:bg-gray-800 text-dark-grey-900 rounded-2xl"/>
                                                <label htmlFor="password"
                                                       className="mb-2 text-sm text-start text-grey-900">Password*</label>
                                                <input id="password" type="password" placeholder="Enter a password" value={password} onChange={handlePasswordChange}
                                                       className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-800 placeholder:text-grey-700 bg-gray-200 dark:bg-gray-800 text-dark-grey-900 rounded-2xl"/>
                                                <div className="flex flex-row justify-between mb-8">
                                                    <label
                                                        className="relative inline-flex items-center mr-3 cursor-pointer select-none">
                                                        <input type="checkbox" checked value=""
                                                               className="sr-only peer"/>
                                                        <div onClick={clickCheckBox}
                                                            className="w-5 h-5 bg-gray-700 border-2 rounded-sm border-grey-500 peer peer-checked:border-0 peer-checked:bg-purple-blue-500">
                                                            {check && <img className=""
                                                                 src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/icons/check.png"
                                                                 alt="tick"/>
                                                            }
                                                        </div>
                                                        <span className="ml-3 text-sm font-normal text-slate-400">Keep me logged in</span>
                                                    </label>
                                                    <a href="javascript:void(0)" className="mr-4 text-sm font-medium text-slate-400" onClick={forgetPassword}>
                                                        Forget password?
                                                    </a>
                                                </div>
                                                <button onClick={loginNow}
                                                    className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-primary">
                                                    Sign In
                                                </button>
                                                <p className="text-sm leading-relaxed text-slate-400">
                                                    Not registered yet?
                                                    <a href="javascript:void(0)" className="p-2 font-bold text-gray-300" onClick={createAccount}>Create an Account</a>
                                                </p>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;
