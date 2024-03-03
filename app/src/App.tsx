import './App.css';
import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// routing
import Routes from './routes';

// defaultTheme
import themes from './themes';

// project imports
import NavigationScroll from './layout/NavigationScroll';
import { ApolloProvider } from '@apollo/client';
import { client } from './api/api';
import { AuthContextProvider } from './context/AuthContext';
import { MultiSelectContextProvider } from './context/MuliSelectContext';
import { DialogContextProvider } from './context/DialogContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const customization = useSelector((state: any) => state?.customization);
  console.log((import.meta as any).env);
  return (
    <GoogleOAuthProvider clientId={(import.meta as any).env?.VITE_GOOGLE_OAUTH_API}>
      <ApolloProvider client={client}>
        <AuthContextProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MultiSelectContextProvider>
              <DialogContextProvider>
                <StyledEngineProvider injectFirst>
                  <ThemeProvider theme={themes(customization)}>
                    <CssBaseline />
                    <NavigationScroll>
                      <Routes />
                    </NavigationScroll>
                  </ThemeProvider>
                </StyledEngineProvider>
              </DialogContextProvider>
            </MultiSelectContextProvider>
          </LocalizationProvider>
        </AuthContextProvider>
      </ApolloProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
