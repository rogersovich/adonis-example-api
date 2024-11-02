/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const PersonsController = () => import('#controllers/persons_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.group(() => {
  router.get('persons', [PersonsController, 'all']).as('persons.index')
  router.get('persons/:id', [PersonsController, 'show'])
}).prefix('/api')
