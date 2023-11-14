import { useColorMode, Box, IconButton } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const ThemeToggler = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Box position="absolute" top="5rem" right="1rem">
            <IconButton
                aria-label="Toggle dark mode"
                icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
                onClick={toggleColorMode}
                variant="ghost"
            />
        </Box>
    );
}

export default ThemeToggler;