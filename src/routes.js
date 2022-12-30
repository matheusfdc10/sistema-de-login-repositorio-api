import { Router } from 'express';
import auth from './middlewares/auth'
import SessionsController from './controllers/SessionsController';
import UserController from './controllers/UserController';
import RepositoriesController from './controllers/RepositoriesController';

const routes = new Router();

// -----controler publicos-----
routes.post('/sessions', SessionsController.create)
routes.post('/user', UserController.create);


// -----middlewares-----
routes.use(auth)


// -----controler privados-----
// routes.get('/users', UserController.index);
// routes.get('/user/:id', UserController.show);
// routes.put('/user/:id', UserController.update);
// routes.delete('/user/:id', UserController.destroy);

routes.get('/user', UserController.getUser);
routes.post('/user/checkPassword', UserController.checkPassword); 
routes.put('/user/updatePassword/:token', UserController.updatePassword);

routes.get('/user/repositories', RepositoriesController.index);
routes.post('/user/repositories', RepositoriesController.create);
routes.put('/user/repositories/:id', RepositoriesController.update);
routes.delete('/user/repositories/:id', RepositoriesController.destroy);

export default routes;