import axios from "axios";
import { getSession } from 'next-auth/react'

const BACKEND_URL = process.env.BACKEND_URL;

const Axios = axios.create({
  baseURL: BACKEND_URL,
});

Axios.interceptors.request.use(async (config) => {
    var session = await getSession({ config });
    if (!session) {
        console.log("Member NOT FOUND")
        return Promise.reject(
            {
                response:
                {
                    data:
                        { error: "REQUIRE_LOGIN" }
                }
            }
        )
    }
    config.headers.email = session.user.email
  return config;
});

export default Axios