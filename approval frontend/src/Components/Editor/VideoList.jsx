import { Box, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

function VideoList() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const getVideos = async () => {
            try {
                const res = await axios.get('/editor/listVideos');
                setVideos(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        getVideos();
    }, []);

    const renderedVideos = videos.map((video) => (
        <Box key={video._id}>
            <Box height="20%" width="30%">
                <video src={video.filePath} title={video.title} allowFullScreen />
            </Box>
            <Box>
                <Text fontWeight="bold" fontSize="10px">{video.title}</Text>
                <Text fontWeight="thin" fontSize="2xs">{video.description}</Text>
                <Box display="flex">
                    <Text fontWeight="thin" fontSize="2xs" style={{color: "beige"}}>Status: {video.status}</Text>
                    <Text fontWeight="thin" fontSize="2xs" style={{color: "beige"}}>For: {video.associatedYoutuber}</Text>
                </Box>
            </Box>
        </Box>
    ));

    return (
        <Box>
            {renderedVideos}
        </Box>
    )
}

export default VideoList;