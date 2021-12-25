const playerRepo = new PlayerRepository(firebase);
const gameRepo = new GameRepository(firebase);
const authenticator = new Authenticator(firebase,playerRepo);
const router = new Router({ mode: 'hash', root: '/'});
const view = new NotView(document); //new View(document);
const controller = new Controller(view,authenticator,router,gameRepo);
