import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import MarkdownView from '../views/MarkdownView.vue'

const mdRoutes = {
  'basic-concepts': [
    { path: 'what-is-llm', file: 'basic-concepts/what-is-llm.md' },
    { path: 'popular-models', file: 'basic-concepts/popular-models.md' },
    { path: 'capabilities', file: 'basic-concepts/capabilities.md' },
    { path: 'history', file: 'basic-concepts/history.md' },
    { path: 'terminology', file: 'basic-concepts/terminology.md' },
    { path: 'technology-stack', file: 'basic-concepts/technology-stack.md' }
  ],
  'prompt-engineering': [
    { path: 'basics', file: 'prompt-engineering/basics.md' },
    { path: 'techniques', file: 'prompt-engineering/techniques.md' },
    { path: 'few-zero-shot', file: 'prompt-engineering/few-zero-shot.md' },
    { path: 'cot', file: 'prompt-engineering/cot.md' },
    { path: 'templates', file: 'prompt-engineering/templates.md' },
    { path: 'optimization', file: 'prompt-engineering/optimization.md' }
  ]
}

function generateRoutes() {
  const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home
    }
  ]

  Object.entries(mdRoutes).forEach(([section, items]) => {
    routes.push({
      path: `/${section}`,
      component: () => import(`../views/${section}/index.vue`),
      children: [
        {
          path: '',
          redirect: items[0].path
        },
        ...items.map(item => ({
          path: item.path,
          name: `${section}-${item.path}`,
          component: MarkdownView,
          props: { mdFile: item.file }
        }))
      ]
    })
  })

  console.log('Generated routes:', routes)
  return routes
}

const router = createRouter({
  history: createWebHistory(),
  routes: generateRoutes()
})

router.beforeEach((to, from, next) => {
  console.log('Navigating to:', to.path)
  console.log('Route matches:', to.matched)
  
  if (to.matched.length === 0) {
    console.log('No matching route, redirecting to home')
    next('/')
  } else {
    next()
  }
})

export default router 