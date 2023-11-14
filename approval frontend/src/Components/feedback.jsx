import { useState } from "react";
import axios from "axios";
import { Box, Button, Textarea } from "@chakra-ui/react";

function Feedback() {
    const [feedback, setFeedback] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/analyze-feedback', {
        feedback: feedback,
      });
      console.log(response.data.category);
      setResponse(response.data.reply);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  return (
    <Box mt="15px" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
      <Box mb="8px" justifyContent="center">
        <Textarea mb="8px" size='sm' value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Give us your feedback" />
        <Button onClick={handleSubmit}>Submit</Button>
      </Box>
      <Box justifyContent="center" width="30%" display="flex">
      {response && <p>{response}</p>}
      </Box>
    </Box>
  );
}

export default Feedback;