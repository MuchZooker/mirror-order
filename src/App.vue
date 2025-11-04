<script setup lang="ts">

import router from '@/router/index'
import { onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';

// 使用组合式API
// 获取IP地址
const fetchIPAddress = async () => {
  try {
    // 使用多个IP查询服务以提高成功率
    const services = [
      'https://api.ipify.org?format=json',
      'https://ipapi.co/json/'
    ];

    let ip = null;

    for (const service of services) {
      try {
        const response = await fetch(service);
        if (response.ok) {
          const data = await response.json();
          ip = data.ip || data.ip;
          if (ip) break;
        }
      } catch (e) {
        console.log(`服务 ${service} 失败:`, e);
      }
    }

    if (!ip) {
      throw new Error('无法获取IP地址');
    }

    if (ip == '122.235.134.39') {
      router.push({
        name: 'order-template'
      });
    }

  } catch (error) {
  }
};


onMounted(() => {
  fetchIPAddress();
});

</script>

<template>

  <RouterView />
</template>

<style scoped></style>
