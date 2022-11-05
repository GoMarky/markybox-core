<template>
  <div :class="$style.editor" ref="element">

  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as markybox from '@/core/';

const element = ref<HTMLElement | null>(null);

const editor = new markybox.HTMLRenderer({
  name: 'user',
  readonly: false,
})

editor
  .setFormat('js')
  .setTheme('light');

const text = `
{
 "name": "@gomarky/markybox-core",
  "version": "1.0.1",
}
`;

editor.onDidSave((saved) => {
  try {
    const data = JSON.parse(saved);

    console.log(data);
  } catch (error) {
    console.log(error);
  }
});

onMounted(() => {
  if (!element.value) {
    throw new Error('Expect element to be defined');
  }

  editor
    .mount(element.value)
    .setText(text)
});
</script>

<style lang="scss" module>
.editor {
  width: 800px;
  height: 600px;
}
</style>
