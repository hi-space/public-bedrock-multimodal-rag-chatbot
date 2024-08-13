'use client'

import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { rgbaToHex } from '@/components/utils/rgba-to-hex'

const whiteColor = '#FFF'
const lightColor = '#F4F4F4'
const darkColor = '#D0D4F1'
const darkPaperBgColor = '#2F3349'
const mainColor = darkColor

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#4A90E2',
      main: '#5C9BE6',
      dark: '#3A6DA0',
      contrastText: whiteColor
    },
    secondary: {
      light: '#B2B4B8',
      main: '#A8AAAE',
      dark: '#949699',
      contrastText: whiteColor
    },
    error: {
      light: '#ED6F70',
      main: '#EA5455',
      dark: '#CE4A4B',
      contrastText: whiteColor
    },
    warning: {
      light: '#FFAB5A',
      main: '#FF9F43',
      dark: '#E08C3B',
      contrastText: whiteColor
    },
    info: {
      light: '#1FD5EB',
      main: '#00CFE8',
      dark: '#00B6CC',
      contrastText: whiteColor
    },
    success: {
      light: '#42CE80',
      main: '#28C76F',
      dark: '#23AF62',
      contrastText: whiteColor
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#F5F5F5',
      A200: '#EEEEEE',
      A400: '#BDBDBD',
      A700: '#616161'
    },
    text: {
      primary: rgbaToHex(`rgba(${mainColor}, 0.78)`),
      secondary: rgbaToHex(`rgba(${mainColor}, 0.68)`),
      disabled: rgbaToHex(`rgba(${mainColor}, 0.42)`)
    },
    divider: rgbaToHex(`rgba(${mainColor}, 0.16)`),
    background: {
      paper: lightColor,
      default: darkPaperBgColor
    },
    action: {
      active: rgbaToHex(`rgba(${mainColor}, 0.54)`),
      hover: rgbaToHex(`rgba(${mainColor}, 0.04)`),
      selected: rgbaToHex(`rgba(${mainColor}, 0.06)`),
      selectedOpacity: 0.06,
      disabled: rgbaToHex(`rgba(${mainColor}, 0.26)`),
      disabledBackground: rgbaToHex(`rgba(${mainColor}, 0.12)`),
      focus: rgbaToHex(`rgba(${mainColor}, 0.12)`)
    }
  },
  typography: {
    fontFamily: [
      'Noto Sans KR',
      'sans-serif',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue'
    ].join(','),
    fontSize: 13.125,
    h1: {
      fontWeight: 500,
      fontSize: '2.375rem',
      lineHeight: 1.368421
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
      lineHeight: 1.375
    },
    h3: {
      fontWeight: 500,
      lineHeight: 1.38462,
      fontSize: '1.625rem'
    },
    h4: {
      fontWeight: 500,
      lineHeight: 1.364,
      fontSize: '1.375rem'
    },
    h5: {
      fontWeight: 500,
      lineHeight: 1.3334,
      fontSize: '1.125rem'
    },
    h6: {
      lineHeight: 1.4,
      fontSize: '0.9375rem'
    },
    subtitle1: {
      fontSize: '1rem',
      letterSpacing: '0.15px'
    },
    subtitle2: {
      lineHeight: 1.32,
      fontSize: '0.875rem',
      letterSpacing: '0.1px'
    },
    body1: {
      lineHeight: 1.467,
      fontSize: '0.9375rem'
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.53846154
    },
    button: {
      lineHeight: 1.2,
      fontSize: '0.9375rem',
      letterSpacing: '0.43px'
    },
    caption: {
      lineHeight: 1.273,
      fontSize: '0.6875rem'
    },
    overline: {
      fontSize: '0.75rem',
      letterSpacing: '1px'
    }
  }
})

const ThemeComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary
          }
        }}
      />
      {children}
    </ThemeProvider>
  )
}

export default ThemeComponent
