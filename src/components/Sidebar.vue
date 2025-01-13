<template>
  <aside class="sidebar">
    <div class="header">
      <h1>知识库目录</h1>
    </div>
    <div class="search-box">
      <el-input
        v-model="searchText"
        placeholder="搜索知识点..."
        prefix-icon="Search"
        clearable
        @input="handleSearch"
      />
      <!-- 搜索结果弹出框 -->
      <div v-if="searchResults.length > 0" class="search-results">
        <div
          v-for="result in searchResults"
          :key="result.path"
          class="search-result-item"
          @click="navigateToContent(result)"
        >
          <div class="result-title">{{ result.title }}</div>
          <div class="result-context">{{ result.context }}</div>
          <div class="result-path">{{ result.path }}</div>
        </div>
      </div>
    </div>
    <el-menu
      :default-active="activeMenu"
      class="menu-container"
      :router="false"
      @select="handleSelect"
    >
      <template v-for="menu in menuItems" :key="menu.id">
        <el-sub-menu :index="menu.path">
          <template #title>
            <span>{{ menu.title }}</span>
          </template>
          <el-menu-item
            v-for="subMenu in menu.children"
            :key="subMenu.id"
            :index="subMenu.path"
          >
            {{ subMenu.title }}
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { menuConfig } from '../config/menuConfig'
import { Search } from '@element-plus/icons-vue'
import debounce from 'lodash/debounce'

const router = useRouter()
const route = useRoute()
const searchText = ref('')
const searchResults = ref([])

// 计算当前激活的菜单项
const activeMenu = computed(() => {
  console.log('Current route path:', route.path)
  return route.path
})

const menuItems = computed(() => {
  if (!searchText.value) return menuConfig
  return menuConfig.map(menu => ({
    ...menu,
    children: menu.children.filter(item => 
      item.title.toLowerCase().includes(searchText.value.toLowerCase())
    )
  })).filter(menu => menu.children.length > 0)
})

// 添加一个用于缓存 MD 文件内容的 Map
const mdContentCache = new Map()

// 加载 MD 文件内容
const loadMdContent = async (path) => {
  if (mdContentCache.has(path)) {
    return mdContentCache.get(path)
  }

  try {
    const response = await fetch(`/src/docs/${path}.md`)
    if (!response.ok) {
      throw new Error(`Failed to load ${path}.md`)
    }
    const content = await response.text()
    mdContentCache.set(path, content)
    return content
  } catch (err) {
    console.error(`Error loading ${path}.md:`, err)
    return null
  }
}

// 修改搜索处理函数
const handleSearch = debounce(async () => {
  if (!searchText.value.trim()) {
    searchResults.value = []
    return
  }

  try {
    const results = []
    const searchTerm = searchText.value.toLowerCase()

    // 遍历所有菜单项
    for (const section of menuConfig) {
      for (const item of section.children) {
        const mdContent = await loadMdContent(item.path.slice(1)) // 移除开头的斜杠
        
        if (mdContent) {
          // 按段落分割内容
          const paragraphs = mdContent.split('\n\n')
          
          for (const paragraph of paragraphs) {
            if (paragraph.toLowerCase().includes(searchTerm)) {
              // 找到匹配的段落，提取上下文
              const start = Math.max(0, paragraph.toLowerCase().indexOf(searchTerm) - 50)
              const end = Math.min(paragraph.length, start + 150)
              const context = paragraph.slice(start, end).trim()
              
              // 获取最近的标题
              const titleMatch = paragraph.match(/^#+\s+(.+)$/m) || ['', '相关内容']
              const nearestTitle = titleMatch[1]

              results.push({
                title: item.title,
                path: item.path,
                context: `...${context}...`,
                menuPath: section.path,
                heading: nearestTitle,
                fullPath: `${item.path}#${nearestTitle.toLowerCase().replace(/\s+/g, '-')}`
              })
            }
          }
        }
      }
    }

    // 限制结果数量并按相关性排序
    searchResults.value = results
      .sort((a, b) => {
        // 标题匹配优先
        const aTitle = a.title.toLowerCase().includes(searchTerm)
        const bTitle = b.title.toLowerCase().includes(searchTerm)
        if (aTitle !== bTitle) return bTitle - aTitle
        return 0
      })
      .slice(0, 5)
  } catch (err) {
    console.error('Search error:', err)
  }
}, 300)

// 修改导航函数
const navigateToContent = (result) => {
  searchResults.value = []
  searchText.value = ''
  
  router.push(result.path).then(() => {
    setTimeout(() => {
      // 尝试找到对应的标题元素
      const headingId = result.heading.toLowerCase().replace(/\s+/g, '-')
      const element = document.getElementById(headingId) || 
                     document.querySelector(`h1, h2, h3, h4, h5, h6, p`)
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        // 添加高亮效果
        element.classList.add('highlight')
        setTimeout(() => element.classList.remove('highlight'), 2000)
      }
    }, 100)
  })
}

// 菜单选择处理
const handleSelect = (index, indexPath) => {
  console.log('Menu item selected:', {
    index,          // 选中项的 index
    indexPath,      // 选中项的路径数组
    currentPath: route.path, // 当前路由路径
    menuConfig: menuItems.value // 当前菜单配置
  })
  
  // 检查路径格式
  if (!index.startsWith('/')) {
    console.log('Adding leading slash to path')
    index = '/' + index
  }
  
  console.log('Navigating to:', index)
  router.push(index).then(() => {
    console.log('Navigation completed')
  }).catch(err => {
    console.error('Navigation failed:', err)
  })
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: 100vh;
  overflow-y: auto;
  position: relative;
}

.header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.header h1 {
  margin: 0;
  color: #409EFF;
  font-size: 24px;
}

.search-box {
  padding: 20px;
  position: relative;
}

.menu-container {
  border-right: none;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 20px;
  right: 20px;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
}

.search-result-item {
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.search-result-item:hover {
  background-color: #f5f7fa;
}

.search-result-item:last-child {
  border-bottom: none;
}

.result-title {
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 4px;
}

.result-context {
  font-size: 0.9em;
  color: #606266;
  margin: 4px 0;
  white-space: pre-wrap;
  word-break: break-word;
  /* 添加搜索词高亮 */
  ::v-deep mark {
    background-color: #ffeaa7;
    padding: 0 2px;
    border-radius: 2px;
  }
}

.result-path {
  font-size: 0.8em;
  color: #909399;
}

.result-heading {
  font-size: 0.85em;
  color: #67c23a;
  margin-top: 4px;
}

/* 添加内容高亮动画 */
:deep(.highlight) {
  animation: highlight-fade 2s ease-out;
}

@keyframes highlight-fade {
  0% { background-color: #ffeaa7; }
  100% { background-color: transparent; }
}
</style> 