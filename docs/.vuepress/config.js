var nav = require('./nav.js')
var { EcosystemNav, ComponentNav, BackendNav } = nav

var utils = require('./utils.js')
var { genNav, getComponentSidebar, deepClone } = utils

module.exports = {
  title: 'frontend-core',
  description: 'The new UI for ADempiere ERP',
  base: '/frontend-core/',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico'
      }
    ]
  ],
  themeConfig: {
    repo: 'solop-develop/frontend-core',
    docsRepo: 'solop-develop/frontend-core',
    docsDir: 'docs',
    editLinks: true,
    sidebarDepth: 3,
    algolia: {
      apiKey: 'ffce0083d0830de5f562c045a481410b',
      indexName: 'vue_element_admin'
    },
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        nav: [
          {
            text: 'Guide',
            link: '/guide/'
          },
          {
            text: 'Features',
            items: genNav([...BackendNav, ...deepClone(ComponentNav)], 'EN')
          },
          {
            text: 'Ecosystem',
            items: genNav(deepClone(EcosystemNav), 'EN')
          },
          {
            text: 'Donate',
            link: '/donate/'
          },
          {
            text: '中文站点(gitee)',
            link: 'https://adempiere-vue.gitee.io/adempiere-vue/zh/'
          }
        ],
        sidebar: {
          '/guide/': [
            {
              title: 'Essentials',
              collapsable: true,
              children: genEssentialsSidebar()
            },
            {
              title: 'Use Cases',
              collapsable: true,
              children: genUseCasesSidebar()
            },
            {
              title: 'Advanced',
              collapsable: true,
              children: genAdvancedSidebar()
            },
            {
              title: 'Components',
              collapsable: true,
              children: genComponentSidebar()
            },
            {
              title: 'Forms',
              collapsable: true,
              children: genFormsSidebar()
            },
            {
              title: 'Other',
              collapsable: true,
              children: [
                '/guide/other/discord.md',
                '/guide/other/gitter.md',
                '/guide/other/telegram.md',
                '/guide/other/release-notes.md'
              ]
            }
          ],
          '/feature/component/': getComponentSidebar(
            deepClone(ComponentNav),
            'EN'
          ),
          '/feature/script/': [
            '/feature/script/svgo.md',
            '/feature/script/new.md'
          ]
        }
      },
      '/es/': {
        label: 'Español',
        selectText: 'Idiomas',
        editLinkText: 'Editar esta página en GitHub',
        nav: [
          {
            text: 'Guía',
            link: '/es/guide/'
          },
          {
            text: 'Características',
            items: genNav([...BackendNav, ...deepClone(ComponentNav)], 'ES')
          },
          {
            text: 'Ecosistema',
            items: genNav(deepClone(EcosystemNav), 'ES')
          },
          {
            text: 'Donar',
            link: '/es/donate/'
          }
        ],
        sidebar: {
          '/es/guide/': [
            {
              title: 'Esenciales',
              collapsable: true,
              children: genEssentialsSidebar('/es')
            },
            {
              title: 'Casos de Uso',
              collapsable: true,
              children: genUseCasesSidebar('/es')
            },
            {
              title: 'Avanzado',
              collapsable: true,
              children: genAdvancedSidebar('/es')
            },
            {
              title: 'Componentes',
              collapsable: true,
              children: genComponentSidebar('/es')
            },
            {
              title: 'Formularios',
              collapsable: true,
              children: genFormsSidebar('/es')
            },
            {
              title: 'Otro',
              collapsable: true,
              children: [
                '/es/guide/other/discord.md',
                '/es/guide/other/gitter.md',
                '/es/guide/other/telegram.md',
                '/es/guide/other/release-notes.md'
              ]
            }
          ],
          '/es/feature/component/': getComponentSidebar(
            deepClone(ComponentNav),
            'ES'
          ),
          '/es/feature/script/': [
            '/es/feature/script/svgo.md',
            '/es/feature/script/new.md'
          ]
        }
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        nav: [
          {
            text: '指南',
            link: '/zh/guide/'
          },
          {
            text: '功能',
            items: genNav([...BackendNav, ...deepClone(ComponentNav)], 'ZH')
          },
          {
            text: '生态系统',
            items: genNav(deepClone(EcosystemNav), 'ZH')
          },
          {
            text: '捐赠',
            link: '/zh/donate/'
          },
          {
            text: '中文站点(gitee)',
            link: 'https://adempiere-vue.gitee.io/adempiere-vue/zh/'
          },
          {
            text: '招聘',
            link: '/zh/job/'
          }
        ],
        sidebar: {
          '/zh/guide/': [
            {
              title: '組件',
              collapsable: true,
              children: genEssentialsSidebar('/zh')
            },
            {
              title: 'Use Cases',
              collapsable: true,
              children: genUseCasesSidebar()
            },
            {
              title: '进阶',
              collapsable: true,
              children: genAdvancedSidebar('/zh')
            },
            {
              title: '成分',
              collapsable: true,
              children: genComponentSidebar()
            },
            {
              title: '形式',
              collapsable: true,
              children: genFormsSidebar()
            },
            {
              title: '其它',
              collapsable: true,
              children: [
                '/zh/guide/other/faq.md',
                '/zh/guide/other/release-notes.md'
              ]
            }
          ],
          '/zh/feature/component/': getComponentSidebar(
            deepClone(ComponentNav),
            'ZH'
          ),
          '/zh/feature/script/': [
            '/zh/feature/script/svgo.md',
            '/zh/feature/script/new.md'
          ]
        }
      }
    }
  },
  locales: {
    '/': {
      lang: 'en-US',
      description: 'The new UI for ADempiere ERP'
    },
    '/zh/': {
      lang: 'zh-CN',
      description: 'The new UI for ADempiere ERP'
    },
    '/es/': {
      lang: 'es-ES',
      description:
        'La nueva UI para ADempiere ERP, tome su tiempo para ver estamaravillosa interfaz adaptada a los requerimientos de su negocio'
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@public': './public'
      }
    }
  },
  ga: 'UA-109340118-1'
}

function genEssentialsSidebar(type = '') {
  const mapArr = [
    '/guide/',
    '/guide/essentials/layout.md',
    '/guide/essentials/router-and-nav.md',
    '/guide/essentials/permission.md',
    '/guide/essentials/tags-view.md',
    '/guide/essentials/new-page.md',
    '/guide/essentials/style.md',
    '/guide/essentials/server.md',
    '/guide/essentials/mock-api.md',
    '/guide/essentials/import.md',
    '/guide/essentials/deploy.md',
    '/guide/essentials/env.md'
  ]
  return mapArr.map(i => {
    return type + i
  })
}

function genUseCasesSidebar(type = '') {
  const mapArr = [
    '/guide/use-cases/process.md',
    '/guide/use-cases/reports.md',
    '/guide/use-cases/smartBrowser.md',
    '/guide/use-cases/window.md',
    '/guide/use-cases/searchTypeForms.md',
    '/guide/use-cases/notes.md',
    '/guide/use-cases/activity.md',
  ]
  return mapArr.map(i => {
    return type + i
  })
}

function genAdvancedSidebar(type = '') {
  const mapArr = [
    '/guide/advanced/cors.md',
    '/guide/advanced/eslint.md',
    '/guide/advanced/git-hook.md',
    '/guide/advanced/style-guide.md',
    '/guide/advanced/lazy-loading.md',
    '/guide/advanced/chart.md',
    '/guide/advanced/icon.md',
    '/guide/advanced/cdn.md',
    '/guide/advanced/theme.md',
    '/guide/advanced/i18n.md',
    '/guide/advanced/error.md',
    '/guide/advanced/webpack.md',
    '/guide/advanced/sass.md'
  ]
  return mapArr.map(i => {
    return type + i
  })
}

function genComponentSidebar(type = '') {
  const mapArr = [
    // '/guide/components/preference.md',
    // '/guide/components/record-access.md',
    '/guide/components/notes.md',
    // '/guide/components/information.md',
    // '/guide/components/update.md',
    // '/guide/components/translation.md',
    // '/guide/components/zoom-in.md',
    '/guide/components/activity.md',
    // '/guide/components/close-tab.md',
    // '/guide/components/close-other-tabs.md',
    // '/guide/components/close-all.md',
    // '/guide/components/export-download-reports.md',
    // '/guide/components/search.md',
    // '/guide/components/change-role.md',
    // '/guide/components/hide-menu.md',
    // '/guide/components/references.md',
    // '/guide/components/lock-unlock-records.md',
    // '/guide/components/dashboard.md',
    '/guide/components/process.md',
    '/guide/components/reports.md',
    '/guide/components/smart-browser.md',
    '/guide/components/guide.md',
    '/guide/components/workflows-and-activities.md'
  ]
  return mapArr.map(i => {
    return type + i
  })
}

function genFormsSidebar(type = '') {
  const mapArr = [
    '/guide/forms/point-of-sales.md',
    '/guide/forms/check-price.md',
    '/guide/forms/product-information.md'
  ]
  return mapArr.map(i => {
    return type + i
  })
}
