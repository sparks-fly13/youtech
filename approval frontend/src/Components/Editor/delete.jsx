import { CloseIcon } from '@chakra-ui/icons';
import { IconButton, useToast } from '@chakra-ui/react';
import axios from 'axios';

function DeleteVideo({ videoId }) {
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await axios.delete(`/editor/deleteVideo/${videoId}`);
      window.location.reload();
    } catch (err) {
      console.error(err.response);
      toast({
        title: 'Error',
        description: 'Failed to delete the video. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteWarning = () => {
    toast({
      title: 'Are you sure?',
      description: 'This will permanently delete the video.',
      status: 'warning',
      duration: 5000,
      isClosable: true,
    });
  }

  const handleRemoveDeleteWarning = () => {
    toast.closeAll();
  }

  return (
    <IconButton icon={<CloseIcon />} onClick={handleDelete} colorScheme="red" variant="outline" size="xs"
        onMouseEnter={handleDeleteWarning} onMouseLeave={handleRemoveDeleteWarning}
    />
  );
}

export default DeleteVideo;
