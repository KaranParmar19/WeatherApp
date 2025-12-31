import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // "default", "sunny", "rainy", "cloudy", "night", "light"
    const [theme, setThemeState] = useState("night");
    const [manualOverride, setManualOverride] = useState(false);

    const setTheme = (newTheme) => {
        // This is for weather updates
        if (!manualOverride) {
            setThemeState(newTheme);
        }
    };

    const toggleTheme = () => {
        setManualOverride(true);
        setThemeState(prev => (prev === 'light' ? 'night' : 'light'));
    };

    React.useEffect(() => {
        // Remove old theme classes
        document.body.classList.remove('theme-default', 'theme-sunny', 'theme-rainy', 'theme-cloudy', 'theme-night', 'theme-light');
        // Add new theme class
        document.body.classList.add(`theme-${theme}`);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
