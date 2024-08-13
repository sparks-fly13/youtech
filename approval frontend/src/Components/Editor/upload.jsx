/* eslint-disable react/prop-types */
// VideoUploadModal.js
import { useState } from 'react';
import { Input, Textarea, Button, FormControl, FormLabel, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useToast } from '@chakra-ui/react';
import axios from 'axios';

const VideoUploadModal = ({ isOpen, onClose }) => {
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video: null,
    associatedYoutuber: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUpload = async () => {
    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('video', formData.video);
    form.append('associatedYoutuber', formData.associatedYoutuber);

    try {
      const response = await axios.post('/editor/upload', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data);
      // Display success message or handle errors
      toast({
        title: response.data.msg,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      onClose(); // Close the modal after successful upload
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: error.response.data.msg,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
    window.location.reload();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Video Upload</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input type="text" name="title" value={formData.title} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea name="description" value={formData.description} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Video</FormLabel>
              <Input type="file" name="video" accept=".mp4,.mkv" onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Associated Youtuber</FormLabel>
              <Input type="text" name="associatedYoutuber" value={formData.associatedYoutuber} onChange={handleChange} />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleUpload}>
            Upload Video
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VideoUploadModal;