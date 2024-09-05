import { useCallback, useEffect, useState } from "react"
import { getEntities } from "../api/userApi"
import { toast } from "react-toastify"

const useSpashHook = () => {
    const [entites, setEntites] = useState([])

    const handleEntitiesAPI = useCallback(async () => {
        const listOfEntites = await getEntities()
        if (listOfEntites.error || listOfEntites.response.error) {
            toast.error(listOfEntites.error.message || listOfEntites.response.message || 'Something went wrong!')
        } else {
            setEntites(listOfEntites)
        }
    }, [])

    useEffect(() => {
        handleEntitiesAPI()
    }, [handleEntitiesAPI])
    return {
        entites
    }
}

export default useSpashHook