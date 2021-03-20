import Link from "next/link"
import Api from "utils/api"
import withAuth from 'hocs/withAuth';
import Header from 'components/Header/Header';
import { Paper, Typography, Box, Grid, Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Router from 'next/router'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(12),
    width: "60vw",
    margin: "0 auto"
  },
  container: {
    padding: "1rem",
  },
  containerDivider: {
    margin: "3rem 0"
  },
  landingImage: {
    borderRadius: ".5rem",
    width: "100%"
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center", 
    paddingRight: "1rem"
  }
}));

export default function Home() {
  const classes = useStyles();

  return (
    <>
      <Paper elevation={3} className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <Box className={classes.container}>
              <img className={classes.landingImage} src="/images/landing.svg" />
            </Box>
          </Grid>
          <Grid item md={6} xs={12}>
            <Box className={classes.container}>
              <Typography variant="h4">
                ¡Bienvenido a Lierno App!
              </Typography>
              <br />
              <Typography variant="body1">
                <strong>Lierno app</strong> es una herramienta web que te permite crear, gestionar y compartir tus personajes y campañas para tus partidas de TTRPGs como Dungeons and Dragons y otros juegos de rol.
              </Typography>
              <br />
              <Typography variant="body1">
                Si tienes sugerencias o mejoras, no dudes en ponerte en contacto con nosotros a través de <Link to href="mailto:lierno.app@gmail.com?subject=Sugerencia%20Lierno%20App">nuestro email</Link>.
              </Typography>
              <br />
              <br />
              <Box className={classes.buttonContainer}>
                <Button
                  disableElevation
                  variant="contained"
                  color="primary"
                  onClick={() => Router.push("/login")}>
                  Empieza a usar Lierno App
              </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}