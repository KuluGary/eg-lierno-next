import { useState } from 'react'
import {
    Avatar,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    IconButton,
    InputAdornment,
    Slide,
    TextField,
    Typography,
} from '@material-ui/core'
import {
    LockOutlined as LockOutlinedIcon,
    Visibility,
    VisibilityOff
} from '@material-ui/icons'
import { grey } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'

import Api from "utils/api"
import withoutAuth from 'hocs/withoutAuth';
import { useAuth } from 'providers/Auth';
import Layout from 'components/Layout/Layout';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.primary.main,
        float: "right"
    },
    progress: {
        color: grey[400]
    }
}));



export default withoutAuth(function login() {
    const classes = useStyles();
    const [username, setUserName] = useState('');
    const [password, setPassWord] = useState('');
    const { setAuthenticated, setUser } = useAuth();

    const [errorState, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const submitHandler = async event => {
        event.preventDefault();
        setLoading(true);
        const response = await Api.fetchInternal('/auth/passport/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.status == 200) {
            setAuthenticated(true);
            setUser(response.user)
        } else {
            setError(response.data?.message)
        }

        setLoading(false);
    }

    return (
        <>
            <Layout pageTitle="Entra a Lierno">
                <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">Entrar</Typography>
                            <form className={classes.form} noValidate onSubmit={submitHandler}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    error={errorState && true}
                                    id="email"
                                    label="Nombre de usuario"
                                    name="username"
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setUserName(e.target.value)}
                                    helperText={errorState && errorState}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    error={errorState && true}
                                    name="password"
                                    label="Contraseña"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={(e) => setPassWord(e.target.value)}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }}
                                />
                                {/* <Link to="/recover" className={classes.link} variant="span">
                                {"Recuperar contraseña"}
                            </Link> */}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                    className={classes.submit}>
                                    {loading ? <CircularProgress className={classes.progress} size={24} /> : 'Entrar'}
                                </Button>
                            </form>
                        </div>
                    </Container>
                </Slide>
            </Layout>
        </>
    )
}, '/characters')
