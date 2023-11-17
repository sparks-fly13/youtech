import axios from "axios";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Box, Button, Text } from "@chakra-ui/react";

function PendingVideosList() {
    const [pendingVideos, setPendingVideos] = useState([]);
    const [hoveredVideo, setHoveredVideo] = useState(null);

    useEffect(() => {
        const getPendingVideos = async () => {
            try {
                const res = await axios.get('/youtuber/pending-videos');
                setPendingVideos(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        getPendingVideos();
    }, []);

    const handleMouseEnter = (videoId) => {
        setHoveredVideo(videoId);
    };
    
    const handleMouseLeave = () => {
        setHoveredVideo(null);
    };

    const handleApproveVideo = async (videoId) => {
        try {
            await axios.post(`/youtuber/approve/${videoId}`);
            setPendingVideos(pendingVideos.filter((video) => video._id !== videoId));
        } catch (err) {
            console.error(err);
        }
    }

    const handleRejectVideo = async (videoId) => {
        try {
            await axios.post(`/youtuber/reject/${videoId}`);
            setPendingVideos(pendingVideos.filter((video) => video._id !== videoId));
        } catch (err) {
            console.error(err);
        }
    }

    const renderedPendingVideos = pendingVideos.map((video) => (
        <Box key={video._id} width="30%" justifyContent="center" m="15px" onMouseEnter={() => handleMouseEnter(video._id)} onMouseLeave={handleMouseLeave}>
            <ReactPlayer style={{cursor: "pointer"}} url={video.filePath} controls={true} pip={true} stopOnUnmount={false} width="90%" height="60%" />
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                <Text fontWeight="bold" fontSize="10px">{video.title}</Text>
                <Text fontWeight="thin" fontSize="2xs">{video.description}</Text>
                <Box display="flex">
                    <Text fontWeight="bold" fontSize="2xs">Status: {video.status}</Text>
                    <Text fontWeight="thin" fontSize="2xs">Uploaded by: {video.uploadedBy}</Text>
                </Box>
            </Box>
            {hoveredVideo === video._id && (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Button bg="green" color="white" p="5px" m="5px" onClick={() => handleApproveVideo(video._id)}>Approve</Button>
                    <Button bg="red" color="white" p="5px" m="5px" onClick={() => handleRejectVideo(video._id)}>Reject</Button>
                </Box>
            )}
        </Box>
    ));

    return (
        <Box display="flex" justifyContent="center">
            {renderedPendingVideos}
        </Box>
    );
}

export default PendingVideosList;