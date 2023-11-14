import { useState } from "react";
import { FormControl, FormLabel, FormHelperText, Input, Button, Flex, Box, InputGroup, InputRightElement, useToast } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import {useHistory} from 'react-router-dom'

function YoutuberLogin() {
    const history = useHistory();
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post('/youtuber/login', {
                email,
                password
            });
                history.push('/youtuber/dashboard');
                window.location.reload();
            return data;
        } catch (err) {
            if (err.response) {
                console.log(err.response.data.error);
                toast({
                    title: 'Error',
                    description: err.response.data.error[0].msg ? err.response.data.error[0].msg : err.response.data.error,
                    status: 'error',
                    duration: '5000',
                    isClosable: true
                });
                console.log(err.response.status);
                console.log(err.response.headers);
            }
        }
    }
    return (
        <Flex mt={40} width="full" align="center" justifyContent="center">
            <Box width="xl" p={8} borderWidth={1} borderRadius={13} borderColor="aliceblue" boxShadow="lg">
                <Box textAlign="center" fontSize="xl">
                    <h1><strong>Login</strong> as youtuber </h1>
                </Box>
                <Box my={4} textAlign="left">
                    <form  onSubmit={handleFormSubmit}>
                        <FormControl isRequired my={3}>
                            <FormLabel>Email address</FormLabel>
                            <Input value={email} onChange={e => setEmail(e.currentTarget.value)} variant="flushed" type="email" placeholder="Enter email" autoComplete="off" />
                            <FormHelperText>We'll never share your email.</FormHelperText>
                        </FormControl>
                        <FormControl isRequired my={6}>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input value={password} type={showPassword ? 'text' : 'password'} onChange={e => setPassword(e.currentTarget.value)} variant="flushed" placeholder="password" autoComplete="off" />
                                <InputRightElement width="3rem">
                                <Button h="1.5rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Button width="full" type="submit">Login</Button>
                    </form>
                </Box>
            </Box>
        </Flex>
    );
}

export default YoutuberLogin;