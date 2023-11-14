import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Button } from '@chakra-ui/react';
import { Box } from '@chakra-ui/layout';
import { useHistory } from 'react-router-dom';

function Home() {
    const history = useHistory();
    return (
        <div className='home'>
            <Accordion allowToggle>
                <AccordionItem>
                    <h2>
                    <AccordionButton width="48">
                        <Box as="span" flex='1' textAlign='left'>
                        Youtuber
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                    <Button onClick={() => history.push("/youtuber/signup")} colorScheme='teal' variant='solid'>Signup</Button>
                    <Button onClick={() => history.push("/youtuber/login")} colorScheme='teal' variant='outline'>Login</Button>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <h2>
                    <AccordionButton width="48">
                        <Box as="span" flex='1' textAlign='left'>
                        Editor
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                    <Button onClick={() => history.push("/editor/signup")} colorScheme='teal' variant='solid'>Signup</Button>
                    <Button onClick={() => history.push("/editor/login")} colorScheme='teal' variant='outline'>Login</Button>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

export default Home;