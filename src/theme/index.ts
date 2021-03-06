import { colors, createMuiTheme } from '@material-ui/core';
import typography from './typography';

const theme = createMuiTheme({
  palette: {
    background: {
      default: colors.common.white,
      paper: colors.common.white,
    },
    primary: {
      main: '#09748e',
    },
    secondary: {
      main: '#0b505d',
    },
    error: {
      main: '#f4bec3',
    },
    warning: {
      main: '#fff3cd',
    },
    info: {
      main: '#cfe2ff',
    },
    success: {
      main: '#d1e7dd',
    },
    text: {
      primary: '#0b505d',
      secondary: colors.blueGrey[600],
    },
  },
  typography,
});

export default theme;
