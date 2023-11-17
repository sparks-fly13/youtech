import { useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Button, Text, Flex, Box } from "@chakra-ui/react";
import Feedback from "../../Components/feedback";
import Navbar from "../../Components/Navbar";
import PendingVideosList from "../../Components/Youtuber/PendingVideosList";

function YoutuberDashboard() {
    const history = useHistory();
    const { user } = useContext(UserContext);

    const handleLogOut = async (e) => {
        e.preventDefault();
        try {
            await axios.get('/logout');
            history.replace('/');
            window.location.reload();
    } catch(err) {
        console.log(err.response);
    }
}
    return(
            <Box>
                <Box>
                    <Navbar />
                    {!!user ? 
                        <Flex direction="column" align="center" justify="center">
                            <Text>Welcome youtuber {user.name}!</Text>
                            <Text>Your email is {user.email}</Text>
                            <Button onClick={handleLogOut}>Log Out</Button>
                            <Feedback />
                        </Flex>
                    : null
                    }
                </Box>
                {/* List of Pending Videos */}
                <PendingVideosList />
            </Box>
    );
}

export default YoutuberDashboard;