import React from 'react';
import { Button, makeStyles, TextField, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Navigate } from 'react-router-dom';
import DataContext from '../context/DataContext';
import { toKeyValArray } from '../utils';

const useStyles = makeStyles(theme => ({
  form: {
    maxWidth: '330px',
    marginTop: '0',
    marginBottom: '0',
    marginRight: 'auto',
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    padding: '20px',
    marginTop: '30px',
  },
  textField: {
    minWidth: 130,
    margin: theme.spacing(1),
  },
}));

const Login = () => {
  const [loginCreds, setLoginCreds] = React.useState({
    email: '',
    username: '',
    password: '',
    password2: '',
    firstName: '',
    lastName: '',
  });
  const [isRegister, setIsRegister] = React.useState(false);
  const [isLogined, setIsLogined] = React.useState(false);
  const [alertSettings, setAlertSettings] = React.useState({
    display: false,
    message: '',
    severity: 'error',
  });
  const classes = useStyles();
  const data = React.useContext(DataContext);

  const openAlert = alertSettings => {
    setAlertSettings(alertSettings);
  };

  const closeAlert = () => {
    setAlertSettings({ display: false, message: alertSettings?.message, severity: alertSettings?.severity });
  };

  const LoginAttempt = async _e => {
    if ([loginCreds.username, loginCreds.password].every(c => c)) {
      await data
        .login(loginCreds.username, loginCreds.password)
        .catch(_e =>
          openAlert({ display: true, message: 'Login failed, check your username and password', severity: 'error' })
        );
      if (data.getAccessToken()) {
        setIsLogined(true);
      }
    } else {
      const errorMessage = `Missing the following fields: ${toKeyValArray(loginCreds)
        .filter(kv => ['username', 'password'].includes(kv.key))
        .filter(kv => !kv.value)
        .map(kv => kv.key)
        .join(', ')}`;
      openAlert({ display: true, message: errorMessage, severity: 'error' });
    }
  };

  const RegisterAttempt = async _e => {
    if (toKeyValArray(loginCreds).every(c => c.value)) {
      if (loginCreds.password === loginCreds.password2) {
        await data
          .register(
            loginCreds.email,
            loginCreds.username,
            loginCreds.password,
            loginCreds.firstName,
            loginCreds.lastName
          )
          .then(_v => {
            openAlert({
              display: true,
              message: 'Registration successful! Please Login',
              severity: 'success',
            });
            setIsRegister(false);
          })
          .catch(_e =>
            openAlert({
              display: true,
              message: 'Registration failed, check your username and password',
              severity: 'error',
            })
          );
      } else {
        const errorMessage = `Passwords do not match`;
        openAlert({ display: true, message: errorMessage, severity: 'error' });
      }
    } else {
      const errorMessage = `Missing the following fields: ${toKeyValArray(loginCreds)
        .filter(kv => !kv.value)
        .map(kv => kv.key)
        .join(', ')}`;
      openAlert({ display: true, message: errorMessage, severity: 'error' });
    }
  };

  const onChange = e => {
    setLoginCreds({ ...loginCreds, [e.currentTarget.id]: e.currentTarget.value });
  };

  return isLogined ? (
    <Navigate to='/movies' />
  ) : (
    <>
      <Snackbar
        id='loginPageAlertSnackbar'
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={alertSettings?.display}
        autoHideDuration={6000}
        onClose={closeAlert}
      >
        <Alert onClose={closeAlert} severity={alertSettings?.severity}>
          {alertSettings?.message}
        </Alert>
      </Snackbar>
      <form id='loginPageForm' className={classes.form}>
        {isRegister && (
          <>
            <TextField
              className={classes.textField}
              label='Email'
              id='email'
              variant='outlined'
              size='small'
              onChange={e => onChange(e)}
            />
            <TextField
              className={classes.textField}
              label='First Name'
              id='firstName'
              variant='outlined'
              size='small'
              onChange={e => onChange(e)}
            />
            <TextField
              className={classes.textField}
              label='Last Name'
              id='lastName'
              variant='outlined'
              size='small'
              onChange={e => onChange(e)}
            />
          </>
        )}
        <TextField
          className={classes.textField}
          label='Username'
          id='username'
          variant='outlined'
          size='small'
          onChange={e => onChange(e)}
        />
        <TextField
          className={classes.textField}
          label='Password'
          id='password'
          variant='outlined'
          size='small'
          onChange={e => onChange(e)}
          type='password'
        />
        {isRegister && (
          <TextField
            className={classes.textField}
            label='Retype password'
            id='password2'
            variant='outlined'
            size='small'
            onChange={e => onChange(e)}
            type='password'
          />
        )}
        {isRegister ? (
          <Button id='registerButton' type='button' color='primary' onClick={async e => await RegisterAttempt(e)}>
            Register
          </Button>
        ) : (
          <Button id='logInButton' type='button' color='primary' onClick={async e => await LoginAttempt(e)}>
            Log in
          </Button>
        )}
        {isRegister ? (
          <Button id='haveAnAccountButton' type='button' color='primary' onClick={_e => setIsRegister(false)}>
            Have an account?
          </Button>
        ) : (
          <Button id='dontHaveAnAccountButton' type='button' color='primary' onClick={_e => setIsRegister(true)}>
            Dont have an account?
          </Button>
        )}
      </form>
    </>
  );
};

export default Login;
