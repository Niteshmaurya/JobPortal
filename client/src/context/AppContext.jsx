import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth, useUser } from "@clerk/clerk-react";



export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const { user } = useUser()
    const { getToken } = useAuth()

    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: ''
    })

    const [isSearched, setIsSearched] = useState(false);

    const [jobs, setJobs] = useState([])

    const [showRecuirterLogin, setShowRecuirterLogin] = useState(false)

    const [companyToken, setCompanyToken] = useState(null)
    const [companyData, setCompanyData] = useState(null)
    const [userData, setUserData] = useState(null)
    const [userApplications, setUserApplications] = useState([])


    // function to fetch job data
    const fetchJobs = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/jobs')

            if (data.success) {
                setJobs(data.jobs)
                console.log("this is fetched jobs from context" + data.jobs)
            }
            else {
                toast.error(data.message)

            }


        } catch (error) {
            toast.error(error.message)

        }
    }

    // function to fetch company data
    const fetchCompanyData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/company/company', { headers: { token: companyToken } })

            if (data.success) {
                setCompanyData(data.company)
                // console.log(data)
            }
            else {
                toast.error(data.message)

            }

        } catch (error) {
            toast.error(error.message)


        }
    }



    // checking user initiallization
    const { userR, isLoaded } = useUser();

    useEffect(() => {
        if (isLoaded && userR) {
            console.log("User details after signup:", userR);
        } else {
            console.log("User is not logged in yet");
        }
    }, [isLoaded, userR]);


    // function to fetch userData
    const fetchUserData = async () => {
        try {

            const token = await getToken();
            console.log("Retrieved Token:", token);

            if (!token) {
                throw new Error("Token not found, user might not be authenticated");
            }

            const { data } = await axios.get(backendUrl + '/api/users/user', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                setUserData(data.user)
            }
            else {
                toast.error(data.message + " hello")
            }

        } catch (error) {
            toast.error(error.message)

        }
    }


    useEffect(() => {
        fetchJobs()

        const storedCompanyToken = localStorage.getItem('companyToken')

        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken)
        }
    }, [])

    useEffect(() => {
        if (companyToken) {
            fetchCompanyData()
        }
    }, [companyToken])


    useEffect(() => {
        if (user) {
            fetchUserData()
        }
    }, [user])

    const value = {
        setSearchFilter,
        searchFilter,
        isSearched,
        setIsSearched,
        jobs, setJobs, showRecuirterLogin, setShowRecuirterLogin,
        companyToken, setCompanyToken, companyData, setCompanyData,
        backendUrl, userData, setUserData, userApplications, setUserApplications, fetchUserData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContext
