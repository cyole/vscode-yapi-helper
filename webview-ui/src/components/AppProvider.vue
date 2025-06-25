<script setup lang="ts">
import { darkTheme, lightTheme, zhCN } from 'naive-ui'
</script>

<template>
  <NConfigProvider
    class="h-full"
    :theme="isDark ? darkTheme : lightTheme"
    :locale="zhCN"
    :theme-overrides="{
      common: {
        borderRadius: '6px',
      },
    }"
  >
    <NMessageProvider
      placement="bottom"
      :container-style="{
        bottom: '100px',
      }"
    >
      <NModalProvider>
        <slot />
      </NModalProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
