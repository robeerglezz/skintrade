const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

const app = express();
const PORT = process.env.PORT || 3000;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new SteamStrategy({
  returnURL: 'https://zoneclicker.com/auth/steam/return',
  realm: 'https://robeerglezz.github.io/skintrade/',
  apiKey: 'D446931D47A428F250DD44B0B0E96937'
}, (identifier, profile, done) => {
  profile.identifier = identifier;
  return done(null, profile);
}));

app.use(session({ secret: 'clave_secreta', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('<h1>Inicio</h1><a href="/auth/steam">Iniciar sesión con Steam</a>');
});

app.get('/auth/steam', passport.authenticate('steam'));

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  (req, res) => res.redirect('/profile')
);

app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  res.send(`<h1>Bienvenido ${req.user.displayName}</h1><img src="${req.user.photos[2].value}"/><br><a href="/logout">Cerrar sesión</a>`);
});

app.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
