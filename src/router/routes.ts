
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'raci', component: () => import('src/pages/Raci.vue') },
      { path: 'todos', component: () => import('src/pages/Todos.vue') },
      { path: 'medien', component: () => import('src/pages/Medien.vue') },
      { path: 'annotations', component: () => import('src/pages/Annotations.vue') },
      { path: 'notes', component: () => import('src/pages/Notes.vue') },
      { path: 'users', component: () => import('src/pages/Users.vue') },
      { path: 'teams', component: () => import('src/pages/Teams.vue') },
      { path: 'account', component: () => import('pages/Account.vue') },
      { path: ':catchAll(.*)*', component: () => import('pages/Index.vue') },
    ]
  },
  /* {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  } */
]

export default routes
