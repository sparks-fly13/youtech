import { useContext, useState } from "react";
import { UserContext } from "../../Context/UserContext";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Button, Text, Flex, Box } from "@chakra-ui/react";
import Feedback from "../../Components/feedback";
import Navbar from "../../Components/Navbar";
import VideoUploadModal from "../../Components/Editor/upload";
import VideoList from "../../Components/Editor/VideoList";

function EditorDashboard() {
    const history = useHistory();
    const { user } = useContext(UserContext);

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleUploadModalOpen = () => setIsUploadModalOpen(true);
    const handleUploadModalClose = () => setIsUploadModalOpen(false);

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
                        <Text>Welcome editor {user.name}!</Text>
                        <Text>Your email is {user.email}</Text>
                        <Button onClick={handleLogOut}>Log Out</Button>
                        <Feedback />
                    </Flex>
                : null
                }
            </Box>
            {/* Upload Video Button */}
            <Box>
                <Button colorScheme="purple" onClick={handleUploadModalOpen}>Upload Video</Button>
                <VideoUploadModal isOpen={isUploadModalOpen} onClose={handleUploadModalClose} />
            </Box>
            {/* List of Videos */}
            <Box display="flex" flexDirection="row">
                <VideoList />
            </Box>
        </Box>
    );
}

export default EditorDashboard;