import './App.css';
import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

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

function App() {
  //@ts-ignore
  const customization = useSelector((state) => state.customization);

  return (
    <ApolloProvider client={client}>
      <AuthContextProvider>
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
      </AuthContextProvider>
    </ApolloProvider>
  );
}

export default App;