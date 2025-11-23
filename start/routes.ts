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
import SettingsController from '#controllers/admin/settings_controller'
import AdminNewsController from '#controllers/admin/news_controller'
import AuthController from '#controllers/auth_controller'
import UsersController from '#controllers/admin/users_controller'
import StorageController from '#controllers/admin/storage_controller'
import AdminPartnersController from '#controllers/admin/partners_controller'
import AdminKeyFiguresController from '#controllers/admin/key_figures_controller'
import { middleware } from '#start/kernel'
router.on('/').renderInertia('home')
router.on('/mentionslegales').renderInertia('mentionslegales')
router.on('/cgu').renderInertia('cgu')

// Auth routes (Google OAuth only)
router.get('/login', [AuthController, 'showLogin']).use([middleware.guest()])
router.get('/register', [AuthController, 'showRegister']).use([middleware.guest()])
router.get('/auth/google/redirect', [AuthController, 'googleRedirect']).use([middleware.guest()])
router.get('/auth/google/callback', [AuthController, 'googleCallback']).use([middleware.guest()])
router.post('/logout', [AuthController, 'logout']).use([middleware.auth()])

router
  .group(() => {
    router.get('getNews', GlobalsController.getNews)
    router.get('getLinks', GlobalsController.getLinks)
    router.get('getSocialNetworks', GlobalsController.getSocialNetworks)
    router.get('getContacts', GlobalsController.getContacts)
    router.get('getPartners', GlobalsController.getPartners)
    router.get('getKeyFigures', GlobalsController.getKeyFigures)
  })
  .prefix('api')

// Admin backoffice routes
router
  .group(() => {
    router.on('/admin').renderInertia('admin/index')
    router.get('/admin/settings', [SettingsController, 'show'])
    router.get('/admin/news', [AdminNewsController, 'index'])
    router.get('/admin/partners', [AdminPartnersController, 'index'])
    router.get('/admin/keyfigures', [AdminKeyFiguresController, 'index'])
    router.get('/admin/users', [UsersController, 'index'])
    router.get('/admin/storage', [StorageController, 'show'])

    // Admin API endpoints
    router
      .group(() => {
        router.get('settings', [SettingsController, 'get'])
        router.post('settings', [SettingsController, 'update'])
        router.get('news', [AdminNewsController, 'list'])
        router.post('news', [AdminNewsController, 'create'])
        router.patch('news/:id', [AdminNewsController, 'update'])
        router.post('news/upload-url', [AdminNewsController, 'uploadUrl'])
        router.post('news/upload', [AdminNewsController, 'upload'])
        router.delete('news/:id', [AdminNewsController, 'destroy'])
        router.get('users', [UsersController, 'list'])
        router.patch('users/:id', [UsersController, 'update'])

        // Partners
        router.get('partners', [AdminPartnersController, 'list'])
        router.post('partners', [AdminPartnersController, 'create'])
        router.post('partners/upload-url', [AdminPartnersController, 'uploadUrl'])
        router.post('partners/upload', [AdminPartnersController, 'upload'])
        router.delete('partners/:id', [AdminPartnersController, 'destroy'])

        // Key Figures
        router.get('keyfigures', [AdminKeyFiguresController, 'list'])
        router.post('keyfigures', [AdminKeyFiguresController, 'create'])
        router.post('keyfigures/reorder', [AdminKeyFiguresController, 'reorder'])
        router.patch('keyfigures/:id', [AdminKeyFiguresController, 'update'])
        router.delete('keyfigures/:id', [AdminKeyFiguresController, 'destroy'])

        // Storage
        router.get('storage/list', [StorageController, 'list'])
        router.get('storage/signed-url', [StorageController, 'signedUrl'])
        router.get('storage/signed-url-by-url', [StorageController, 'signedUrlByUrl'])
        router.post('storage/rename', [StorageController, 'rename'])
        router.delete('storage/object', [StorageController, 'remove'])
      })
      .prefix('/api/admin')
  })
  .use([middleware.auth(), middleware.admin()])
