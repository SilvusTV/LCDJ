/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import GlobalsController from '#controllers/globals_controller'
router.on('/').renderInertia('home')
router.on('/mentionslegales').renderInertia('mentionslegales')
router.on('/cgu').renderInertia('cgu')

router
  .group(() => {
    router.get('getNews', GlobalsController.getNews)
    router.get('getLinks', GlobalsController.getLinks)
    router.get('getSocialNetworks', GlobalsController.getSocialNetworks)
    router.get('getContacts', GlobalsController.getContacts)
  })
  .prefix('api')
