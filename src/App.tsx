import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { Col, Container, CustomInput, Row } from 'reactstrap';
import { Main } from './components/Main';
import { CSSProperties, dark, light } from './theme';

enum Theme {
  Light = 'light',
  Dark = 'dark',
};

export const ThemeContext = React.createContext<Theme>(Theme.Light);

const resetBodyStyles = () => {
  document.body.removeAttribute('style');
};

const applyBodyStyles = (properties: CSSProperties) => {
  if (typeof properties !== 'object') {
    return;
  }

  Object.entries(properties).forEach(([key, value]) => {
    document.body.style.setProperty(key, value === null ? null : value.toString());
  });
};

export const App: React.FunctionComponent = () => {
  const [theme, setTheme] = React.useState(Theme.Light);

  const handleThemeToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const appliedTheme = theme === Theme.Light
      ? Theme.Dark
      : Theme.Light;

    setTheme(appliedTheme);

    if (window.localStorage) {
      window.localStorage.setItem('theme', appliedTheme);
    }
  };

  /**
   * Detect if a theme preference has been set previously and apply if if found.
   * Fallback to detecting preferred colour scheme from Browser/System.
   */
  const initialiseTheme = () => {
    const storedTheme = window.localStorage.getItem('theme') as Theme | null;
    if (storedTheme !== null) {
      setTheme(storedTheme);
      return;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme(Theme.Dark);
    }
  };

  /**
   * Set/re-set global rules that are used to manage the theme
   */
  const updateGlobalThemeRules = () => {
    resetBodyStyles();
    if (theme === Theme.Dark) {
      applyBodyStyles(dark.root as CSSProperties);
    } else {
      applyBodyStyles(light.root as CSSProperties);
    }
  };

  React.useEffect(() => {
    initialiseTheme();
  }, []);

  React.useEffect(
    () => {
      updateGlobalThemeRules();
    },
    [theme]
  );

  return (
    <ThemeContext.Provider value={theme}>
      <div className={"app"}>
        <Container fluid>
          <header>
            <Row>
              <Col>
                <h1>TF Summary</h1>
              </Col>
              <Col xs={"auto"} className={"d-flex align-items-center"}>
                <CustomInput id={"themeSwitch"} type={"switch"} label={theme === Theme.Dark ? 'Dark' : 'Light'} checked={theme === Theme.Dark} onChange={handleThemeToggle} />
              </Col>
            </Row>
          </header>

          <main>
            <Router>
              <Main />
            </Router>
          </main>
        </Container>
      </div>
    </ThemeContext.Provider>
  );
};
