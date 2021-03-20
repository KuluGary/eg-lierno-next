import React, { useEffect, useState } from 'react';

import Api from "utils/api";
import AppBar from '@material-ui/core/AppBar';
import Auth from "utils/auth";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Link from "next/link";
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from 'providers/Auth';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    flex: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    link: {
        color: 'inherit',
        textDecoration: 'none'
    },
    avatar: {
        width: theme.spacing(4),
        height: theme.spacing(4),
        fontSize: "50%",
        backgroundColor: theme.palette.secondary.main
    }
}));

function Header(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [user, setUser] = useState();
    const [avatar] = useState();
    const open = Boolean(anchorEl);
    const { isAuthenticated, setAuthenticated } = useAuth();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = () => {
        Api.fetchInternal("/auth/passport/logout")
            .then(() => {
                setAnchorEl(null);
                setAuthenticated(false);
                // fetch('/api/logout')
                //     .then(() => setAuthenticated(false))
            })
    }

    return (
        <div className={classes.root}>
            <AppBar
                color={props.mode ? 'inherit' : 'primary'}
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: props.open,
                })} >
                <Toolbar>
                    {isAuthenticated &&
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            // onClick={props.handleDrawer}
                            edge="start"
                            className={clsx(classes.menuButton, {
                                [classes.hide]: props.open,
                            })}
                        >
                            <MenuIcon />
                        </IconButton>
                    }
                    <div className={classes.flex}>
                        <Typography variant="h6" noWrap>
                            <Link href='/' className={classes.link}>
                                Lierno
                            </Link>
                        </Typography>
                        <div>
                            
                                <Button onClick={() => Api.fetchInternal('/auth/passport/user')} variant="outlined" >USE</Button>
                            
                            {isAuthenticated ?
                                <IconButton
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    {avatar || (user && user.metadata.avatar) ?
                                        <Avatar
                                            src={avatar || (user && user.metadata.avatar)}
                                            className={classes.avatar}
                                            alt={user && user.metadata.first_name + ' ' + user.metadata.last_name}
                                        /> :
                                        <Avatar
                                            className={classes.avatar}
                                            alt={user && user.metadata.first_name + ' ' + user.metadata.last_name}>
                                            {user && (user.metadata.first_name + ' ' + user.metadata.last_name).match(/\b(\w)/g).join('')}
                                        </Avatar>
                                    }
                                </IconButton>
                                : <>
                                    <Link href={'/register'} style={{ marginRight: "1rem" }} className={classes.link}>
                                        <Button>Signup</Button>
                                    </Link>
                                    <Link href={'/login'} className={classes.link}>
                                        <Button variant="outlined" >Login</Button>
                                    </Link>
                                </>
                            }

                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => {
                                    handleClose();
                                    props.history.push("/profile")
                                }}>Mi cuenta</MenuItem>
                                <MenuItem onClick={logout}>Salir</MenuItem>
                            </Menu>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;