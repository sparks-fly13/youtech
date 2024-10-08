import axios from "axios";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Box, Text, useToast } from "@chakra-ui/react";

function ApprovedVideosList() {
    const [approvedVideos, setApprovedVideos] = useState([]);
    const toast = useToast();

    const handleYoutubeUploadClick = async (videoId) => {
        try {
            await axios.post(`/upload/${videoId}`);
            // Assuming the upload was successful, redirect to the profile page
            window.location.href = '/youtuber/dashboard';
        } catch (err) {
            console.error('Upload error:', err);
            // If there's an error, it might be because of a failed upload or some server issue
            toast({
                title: "Failed to upload video to YouTube",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };




    useEffect(() => {
        const getApprovedVideos = async () => {
            try {
                const res = await axios.get('/youtuber/approved-videos');
                setApprovedVideos(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        getApprovedVideos();
    }, []);

    const renderedApprovedVideos = approvedVideos.map((video) => (
        <Box key={video._id} width="30%" justifyContent="center" m="15px">
            <ReactPlayer style={{ cursor: "pointer" }} url={video.filePath} controls={true} pip={true} stopOnUnmount={false} width="90%" height="60%" />
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                <Text fontWeight="bold" fontSize="10px">{video.title}</Text>
                <Text fontWeight="thin" fontSize="2xs">{video.description}</Text>
                <Box display="flex">
                    <Text fontWeight="bold" fontSize="2xs">Status: {video.status}</Text>
                    <Text fontWeight="thin" fontSize="2xs">Uploaded by: {video.uploadedBy}</Text>
                </Box>
                {/*upload to youtube button*/}
                {video.status === 'approved' && (
                    <Box as="button" style={{ backgroundColor: 'violet', marginTop: '3px' }} onClick={() => handleYoutubeUploadClick(video._id)}>
                        <Text fontWeight="bold" fontSize="2xs">Upload to YouTube</Text>
                    </Box>
                )}
            </Box>
        </Box>
    ));

    return (
        <Box display="flex" justifyContent="center">
            {renderedApprovedVideos}
        </Box>
    );
}

export default ApprovedVideosList;