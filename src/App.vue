<template>
  <div class="app-container">
    <Sidebar />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Microsoft YaHei', sans-serif;
}

#app {
  height: 100%;
}

.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 