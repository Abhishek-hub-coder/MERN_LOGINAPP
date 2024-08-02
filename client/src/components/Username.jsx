import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate } from '../helper/validate'
import { useAuthStore } from '../store/store.js'
import styles from '../styles/Username.module.css'




export default function Username() {
    //    by doin this  we can access the username
    // useAuthStore(state => console.log(state.auth.username));

    // navigate the user to the different route.
    const navigate = useNavigate();
    // specifying the value to the username
    const setUsername = useAuthStore(state => state.setUsername);
    //  Accessing the username variable
    // const username = useAuthStore(state => state.auth.username);


    // useEffect(() => {
    //     console.log(username);
    // })


    const formik = useFormik({
        initialValues: {
            username: ''
        },
        validate: usernameValidate,  // Use the function directly
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async values => {

            setUsername(values.username);
            //  redirecting user to the password component
            navigate('/password')



        }
    });

    return (
        <div className="container mx-auto ">
            <Toaster position='top-center'
                reverseOrder={false}

            ></Toaster>
            <div className='flex justify-center items-center h-screen'>
                <div className={styles.glass}>
                    <div className="title flex flex-col items-center">
                        <h4 className='text-5xl font-bold'>Hello Again!</h4>
                        <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                            Explore More by connecting with us .
                        </span>
                    </div>


                    <form className='py-1' onSubmit={formik.handleSubmit}>
                        <div className='profile flex justify-center py-4'>
                            <img src={avatar} className={styles.profile_img} alt="avatar" />

                        </div>


                        <div className='textbox flex flex-col items-center gap-6'>
                            <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username' />
                            <button className={styles.btn} type='submit'>Let's go</button>
                        </div>




                        <div className='text-center py-4'>

                            <span className='text-gray-500'>Not a member  <Link className='text-red-500' to="/register">Register Now</Link></span>
                        </div>

                    </form>


                </div>

            </div>
        </div>
    )
}
