<template>
  <div class="content-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <suspense>
          <component :is="Component" />
          <template #fallback>
            <div>Loading...</div>
          </template>
        </suspense>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('BasicConcepts view mounted') // 调试用
})
</script>

<style scoped>
.content-container {
  padding: 20px;
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