/** MAKE Api requests */
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

// specify backend domain
axios.defaults.baseURL = import.meta.env.VITE_APP_SERVER_DOMAIN;



/**Authenticate function */
/** Authenticate function */
export async function authenticate(username) {
    try {
        const response = await axios.post('/api/authenticate', { username });
        return response.data; // Assuming your backend returns data directly
    } catch (error) {
        return { error: "Username does not exist" };
    }
}


/**Get user details */
export async function getUser({ username }) {
    try {
        // $ as for value of the user
        const { data } = await axios.get(`api/user/${username}`)
        return { data };
        // returning data as a object
    }
    catch (error) {
        return { error: "Password doesnot Match..!" };
    }
}



/**register user function */
// helper.js



export async function registerUser(credentials) {
    try {
        const response = await axios.post(`/api/register`, credentials);
        const { data: { msg }, status } = response;
        let { username, email } = credentials;

        if (status === 201) {
            await axios.post('/api/registerMail', { username, userEmail: email, text: msg });
        }

        return Promise.resolve(msg);
    } catch (error) {
        console.error('Error in registerUser:', error.response ? error.response.data : error.message);
        return Promise.reject(error.response ? error.response.data : { error: 'An unexpected error occurred' });
    }
}




// login function to verify password.
export async function verifyPassword({ username, password }) {
    try {
        if (username) {
            const { data } = await axios.post('/api/login', { username, password });
            // resolve the promise and return the data variable
            return Promise.resolve({ data });
        }
    }
    catch (error) {
        return Promise.reject({ error: "Password does not match!..." })
    }

}

// update user profile function
export async function updateUser(response) {
    try {
        // getting toke from the local storage
        const token = localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', response, { headers: { "Authorization": `Bearer ${token}` } });
        return Promise.resolve(data);

    } catch (error) {
        return Promise.reject({ error: "Could not update Profile...!" });
    }
}


export async function generateOTP(username) {
    try {
        const { data: { code }, status } = await axios.get('/api/generateOTP', { params: { username } });

        // send mail with the OTP
        if (status === 201) {
            let { data: { email } } = await getUser({ username });
            let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject: "Password Recovery OTP" })
        }
        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({ error });
    }
}

export async function verifyOTP({ username, code }) {
    try {
        const { data, status } = await axios.get('/api/verifyOTP', { params: { username, code } });
        return { data, status };
    } catch (error) {
        return Promise.reject({ error });
    }
}




/** reset Password */
export async function resetPassword({ username, password }) {
    try {
        const { data, status } = await axios.put('/api/resetPassword', { username, password });
        return Promise.resolve({ data, status })
    } catch (error) {
        return Promise.reject({ error })
    }
}



/** Getting username from the token */
/** we are getting this token , because if we update our browser, we donot need to fillt he form again to get user information. */
export async function getUsername() {
    const token = localStorage.getItem('token');
    if (!token) {
        return Promise.reject("Cannot find token");
    }
    let decode = jwtDecode(token);
    return decode;
}