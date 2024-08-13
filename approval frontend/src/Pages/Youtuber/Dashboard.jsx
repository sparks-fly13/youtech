import { useContext, useState } from "react";
import { UserContext } from "../../Context/UserContext";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Button, Text, Flex, Box } from "@chakra-ui/react";
import Feedback from "../../Components/feedback";
import Navbar from "../../Components/Navbar";
import PendingVideosList from "../../Components/Youtuber/PendingVideosList";
import ApprovedVideosList from "../../Components/Youtuber/ApprovedVideosList";

function YoutuberDashboard() {
    const history = useHistory();
    const { user } = useContext(UserContext);

    const [pendingVideos, setPendingVideos] = useState(true);

    const handleLogOut = async (e) => {
        e.preventDefault();
        try {
            await axios.get('/logout');
            history.replace('/');
            window.location.reload();
        } catch (err) {
            console.log(err.response);
        }
    }

    const handleVideoListType = async (e) => {
        e.preventDefault();
        if (pendingVideos) {
            setPendingVideos(false);
        } else {
            setPendingVideos(true);
        }
    }

    return (
        <Box>
            <Box>
                <Navbar />
                {user ?
                    <Flex direction="column" align="center" justify="center">
                        <Text>Welcome youtuber {user.name}!</Text>
                        <Text>Your email is {user.email}</Text>
                        <Button onClick={handleLogOut}>Log Out</Button>
                        <Feedback />
                    </Flex>
                    : null
                }
            </Box>
            {/* Button to render pending videos or approved videos */}
            <Button onClick={handleVideoListType}>Toggle to see approved or pending videos</Button>
            {pendingVideos ? (<>
                <h1>List of Pending Videos</h1>
                <PendingVideosList />
            </>) : (<>
                <h1>List of Approved Videos</h1>
                <ApprovedVideosList />
            </>)
            }
        </Box>
    );
}

export default YoutuberDashboard;