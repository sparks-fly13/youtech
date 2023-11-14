import axios from 'axios';
import { createContext, useState, useEffect } from 'react';

const UserContext = createContext({});

function UserProvider({children}) {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        if(!user) {
            axios.get('/profile')
            .then(({data}) => {
                setUser(data);
            })
            .catch(err => {
                console.log(err.response);
            })
        }
    }, [user]);
    
    return (
        <UserContext.Provider value={{ user, setUser }}>
        {children}
        </UserContext.Provider>
    );
};

export {UserContext};
export default UserProvider;