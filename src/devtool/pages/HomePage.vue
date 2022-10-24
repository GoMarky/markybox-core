<template>
  <div class="player-wrapper" ref="element">

  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as markybox from '@/core/';

const element = ref<HTMLElement | null>(null);

const editor = new markybox.HTMLRenderer({
  mode: 'embed',
  name: 'small',
  width: 600,
  height: 400,
  fullscreen: false,
});

onMounted(() => {
  if (!element.value) {
    throw new Error('Expect element to be defined');
  }

  editor.mount(element.value);
});
</script>
