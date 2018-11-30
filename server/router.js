const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getGames', mid.requiresLogin, controllers.Game.getGames);
  app.delete('/remove', mid.requiresLogin, controllers.Game.removeGame);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/addPage', mid.requiresLogin, controllers.Game.addPage);
  app.post('/addPage', mid.requiresLogin, controllers.Game.add);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/search', mid.requiresLogin, controllers.Game.searchGames);
  app.get('/default', mid.requiresLogin, controllers.Game.defaultPage);
  app.get('/list', mid.requiresLogin, controllers.Game.listPage);
  app.get('/log', mid.requiresLogin, controllers.Game.logPage);
  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);
};

module.exports = router;
