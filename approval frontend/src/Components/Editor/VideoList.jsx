import { Box, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import DeleteVideo from "./delete";
import ReactPlayer from "react-player";

function VideoList() {
  const [videos, setVideos] = useState([]);
  const [hoveredVideo, setHoveredVideo] = useState(null);

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

  const handleMouseEnter = (videoId) => {
    setHoveredVideo(videoId);
  };

  const handleMouseLeave = () => {
    setHoveredVideo(null);
  };

  const renderedVideos = videos.map((video) => (
    <Box
      key={video._id}
      position="relative"
      onMouseEnter={() => handleMouseEnter(video._id)}
      onMouseLeave={handleMouseLeave}
      width="30%"
      justifyContent="center"
      m="15px"
    >
            <ReactPlayer style={{cursor: "pointer"}} url={video.filePath} controls={true} pip={true} stopOnUnmount={false} width="90%" height="60%" />
        <Box position="absolute" right="0" top="0">
            {hoveredVideo === video._id && <DeleteVideo videoId={video._id} />}
        </Box>
        <Box>
            <Text fontWeight="bold" fontSize="10px">{video.title}</Text>
            <Text fontWeight="thin" fontSize="2xs">{video.description}</Text>
            <Box display="flex">
                <Text fontWeight="thin" fontSize="2xs">Status: {video.status}</Text>
                <Text fontWeight="thin" fontSize="2xs">For: {video.associatedYoutuber}</Text>
            </Box>
        </Box>
    </Box>
  ));

  return (
    <Box display="flex" justifyContent="center">
      {renderedVideos}
    </Box>
  );
}

export default VideoList;
