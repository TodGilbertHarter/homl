view = new View(document);
authenticator = new Authenticator(firebase);
router = new Router({ mode: 'hash', root: '/'});
controller = new Controller(view,authenticator,router);
