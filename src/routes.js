import { Router } from 'express';
import auth from './middlewares/auth'
import SessionsController from './controllers/SessionsController';
import UserController from './controllers/UserController';
import RepositoriesController from './controllers/RepositoriesController';

const routes = new Router();

// -----controler publicos-----
routes.post('/sessions', SessionsController.create)
routes.get('/sessions/:token/:email', SessionsController.validUser)
routes.post('/user', UserController.create);


// -----middlewares-----
routes.use(auth)


// -----controler privados-----
routes.put('/sessions/:token/:email', SessionsController.logout)

// routes.get('/users', UserController.index);
// routes.get('/user/:id', UserController.show);
// routes.put('/user/:id', UserController.update);
// routes.delete('/user/:id', UserController.destroy);

routes.post('/user/:id/checkPassword', UserController.checkPassword); 
routes.put('/user/:id/updatePassword/:token', UserController.updatePassword);
routes.put('/user/:id/updatePassword/:token', UserController.updatePassword);

routes.get('/user/:user_id/repositories', RepositoriesController.index);
routes.post('/user/:user_id/repositories', RepositoriesController.create);
routes.put('/user/:user_id/repositories/:id', RepositoriesController.update);
routes.delete('/user/:user_id/repositories/:id', RepositoriesController.destroy);

export default routes;