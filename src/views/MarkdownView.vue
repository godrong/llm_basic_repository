<template>
  <div class="markdown-content">
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else v-html="renderedContent"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import { defineProps } from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const props = defineProps({
  mdFile: {
    type: String,
    required: true
  }
})

const renderedContent = ref('')
const loading = ref(false)
const error = ref(null)
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) {}
    }
    return ''
  }
})

const loadMarkdown = async () => {
  loading.value = true
  error.value = null
  
  try {
    console.log('Loading markdown file:', props.mdFile)
    const response = await fetch(`/src/docs/${props.mdFile}`)
    if (!response.ok) {
      throw new Error(`Failed to load markdown: ${response.statusText}`)
    }
    const text = await response.text()
    console.log('Markdown content loaded:', text.substring(0, 100))
    renderedContent.value = md.render(text)
  } catch (err) {
    console.error('Error loading markdown:', err)
    error.value = '内容加载失败: ' + err.message
  } finally {
    loading.value = false
  }
}

onMounted(loadMarkdown)

watch(() => props.mdFile, loadMarkdown)
</script>

<style>
.markdown-content {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.markdown-content h1 {
  margin-top: 0;
  color: #303133;
}

.markdown-content h2 {
  margin-top: 24px;
  color: #409EFF;
}

.markdown-content p {
  line-height: 1.6;
  color: #606266;
}

.markdown-content ul {
  padding-left: 20px;
}

.markdown-content li {
  margin: 8px 0;
  color: #606266;
}
</style> 