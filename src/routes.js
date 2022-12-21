import { Router } from 'express';
import auth from './middlewares/auth'
import SessionsController from './controllers/SessionsController';
import UserController from './controllers/UserController';
import RepositoriesController from './controllers/RepositoriesController';

const routes = new Router();

// controler publicos
routes.post('/sessions', SessionsController.create)
routes.post('/user', UserController.create);

// middlewares
routes.use(auth)

// controler privados
routes.get('/users', UserController.index);
routes.get('/user/:id', UserController.show);
routes.put('/user/:id', UserController.update);
routes.delete('/user/:id', UserController.destroy);

routes.get('/user/:user_id/repositories', RepositoriesController.index);
routes.post('/user/:user_id/repositories', RepositoriesController.create);
routes.delete('/user/:user_id/repositories/:id', RepositoriesController.destroy);

export default routes;