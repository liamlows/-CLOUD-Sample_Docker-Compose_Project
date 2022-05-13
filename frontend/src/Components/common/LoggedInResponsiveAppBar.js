import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useLocation } from 'react-router-dom';
import "./ResponsiveAppBar.css";
import AccessibilityTwoToneIcon from '@mui/icons-material/AccessibilityTwoTone';
import PeopleTwoToneIcon from '@mui/icons-material/PeopleTwoTone';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export const LoggedInResponsiveAppBar = ({ pages, settings, signOut, account_id, account_type }) => {
  const location = useLocation();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  console.log(account_type);
  return (
    <AppBar position="static" sx={{ background: 'green' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            Course Pickle
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => {
                return (
                <div key={page.label}>
                  {(account_type === "professor" || account_type === "admin") && <MenuItem key={page.label} component={Link} to={`/users`} onClick={handleCloseNavMenu}>
                    <PeopleTwoToneIcon />
                    <Typography className="m-1" textAlign="center">{page.label}</Typography>
                  </MenuItem>}
                  {(account_type === "student" || account_type === "ta") && page.route === '/users/:account_id/friends' && <MenuItem key={page.label} component={Link} to={`/users/${account_id}/friends`} onClick={handleCloseNavMenu}>
                    <PeopleTwoToneIcon />
                    <Typography className="m-1" textAlign="center">{page.label}</Typography>
                  </MenuItem>}
                  {page.route === '/classes' && <MenuItem key={page.label} component={Link} to={`/classes`} onClick={handleCloseNavMenu}>
                    <ShoppingCartIcon />
                    <Typography className="m-1" textAlign="center">{page.label}</Typography>
                  </MenuItem>}

                  {page.route === '/' && <MenuItem key={page.label} component={Link} to={'/'} onClick={handleCloseNavMenu}>
                    <HomeIcon />
                    <Typography className="m-1" textAlign="center">{page.label}</Typography>
                  </MenuItem>}
                </div>
              )})}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <div key={page.label}>
                {(account_type === "student" || account_type === "ta") && page.route === '/users/:account_id/friends' && <Button
                  key={page.label}
                  component={Link}
                  to={`/users/${account_id}/friends`}
                  onClick={handleCloseNavMenu}
                  className="btn"
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.label}
                </Button>}
                {(account_type === "professor" || account_type === "admin") && page.route === '/users/:account_id/friends' && <Button
                  key={page.label}
                  component={Link}
                  to={`/users`}
                  className="btn"
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  People
                  </Button>}

                {page.route === '/classes' && <Button
                  key={page.label}
                  className="btn"
                  component={Link}
                  to={`/classes`}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.label}
                </Button>}

                {page.route === '/' && <Button
                  key={page.label}
                  component={Link}
                  to={'/'}
                  onClick={handleCloseNavMenu}
                  className="btn"
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.label}
                </Button>}

              </div>

            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <AccessibilityTwoToneIcon onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {/* changed Alt to account. Dont know what that did, but may need to pass in username */}
              </AccessibilityTwoToneIcon>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <div key={setting.label}>
                  {setting.route === '/users' && <MenuItem textAlign="center" component={Link} to={`${setting.route}/${account_id}`}>{setting.label}</MenuItem>}
                  {setting.route === '/signout' && <MenuItem textAlign="center" component={Link} to={location.pathname} onClick={signOut}>{setting.label}</MenuItem>}
                </div>
              ))}

            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar >
  );
};
export default LoggedInResponsiveAppBar;
