
import React from 'react'
import App from 'next/app'
import { AuthProvider } from 'providers/Auth'
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider, withStyles, createMuiTheme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from 'utils/theme';
import cookie from 'cookie'
import { apolloClient } from "apollo/client";
import Api from 'utils/api';

const styles = theme => ({
  '@font-face': {
    "font-family": "JSL Ancient",
    src: 'local("JSL Ancient"), url("assets/fonts/jacnient.ttf") format("truetype")'
  },
  '@global': {
    b: {
      fontWeight: 500
    },
    '::-webkit-scrollbar': {
      width: "6px",
      opacity: .5
    },
    '::-webkit-scrollbar-track': {
      backgroundColor: "rgba(0,0,0,0.2)",
      borderRadius: "20px"
    },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: "rgba(255,255,255,0.5)",
      borderRadius: "20px"
    },
    '::-webkit-scrollbar-thumb:hover': {
      backgroundColor: "rgba(255,255,255,0.8)",
    }
  }
});

class MyApp extends App {
  state = {
    isAuthenticated: false,
    hasLoaded: false,
    darkMode: false
  }

  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    this.setState({
      innerWidth: window.innerWidth
    })
  }

  render() {
    const { Component, pageProps, authenticated, user } = this.props;
    const muiTheme = createMuiTheme({
      palette: {
        type: this.state.darkMode ? 'dark' : 'light',
      },
      ...theme
    })

    return (
      <AuthProvider authenticated={authenticated} user={user}>
        <ApolloProvider client={apolloClient}>
          <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Box style={{
              maxWidth: 1440,
              margin: this.state.innerWidth > 1440 ? '5rem auto' : (this.state.innerWidth < 512 ? '5rem 1rem' : '5rem 1rem 1rem 5rem')
            }}>
              <Component {...pageProps} />
            </Box>
          </ThemeProvider>
        </ApolloProvider>
      </AuthProvider>
    )
  }
}

MyApp.getInitialProps = async appContext => {
  let authenticated = false;
  const request = appContext.ctx.req;
  const appProps = await App.getInitialProps(appContext);

  if (request) {
    request.cookies = cookie.parse(request.headers.cookie || '');
    authenticated = !!request.cookies['connect.sid'];
  }

  const user = await Api.fetchInternal("/auth/passport/user").catch(err => authenticated = false)

  if (user.status !== 200) {
    authenticated = false;
  }

  return { ...appProps, authenticated, user: user?.data?.id }
}

export default withStyles(styles, { withTheme: true })(MyApp);