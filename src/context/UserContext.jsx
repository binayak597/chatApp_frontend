import { createContext, useEffect, useState } from "react";
import { getUserData } from "../utils/handleApi";


export const UserContext = createContext();


export const UserContextProvider = ({children}) => {

    const [userName, setUserName] = useState(null);
    const [id, setId] = useState(null);
       
   useEffect(() => {
    getUserData().then((response) => {
        
            console.log(response.data);
            setUserName(response.data.userName);
            setId(response.data.userId);
          
    })
    .catch((error) => console.log(error));
   }, []);

    return (
        <UserContext.Provider value={{userName, setUserName, id, setId}}>
            {children}
        </UserContext.Provider>
    );
}