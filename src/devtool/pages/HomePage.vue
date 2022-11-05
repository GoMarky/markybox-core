<template>
  <div :class="$style.editor" ref="element">

  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as markybox from '@/core/';

const element = ref<HTMLElement | null>(null);

const editor = new markybox.HTMLRenderer({
  name: 'small',
})

editor
  .setFormat('js')
  .setTheme('light');

onMounted(() => {
  if (!element.value) {
    throw new Error('Expect element to be defined');
  }

  editor
    .mount(element.value)
    .setText('{ "markybox": true }')
});
</script>

<style lang="scss" module>
.editor {
  width: 400px;
  height: 250px;
}
</style>
