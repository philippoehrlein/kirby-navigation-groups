<template>
  <k-item 
    v-if="item.type === 'page'"
    :sortable="item.sortable" 
    :text="item.text" 
    :link="'pages/' + item.path"
    :image="normalizedImage"
    class="k-draggable-item">
    <template #options>
      <k-button 
        :icon="'status-' + item.flag.status" 
        :data-type="'status-' + item.flag.status"
        :data-theme="item.flag.status === 'listed' ? 'positive-icon' : 'info-icon'" 
        class="k-button k-status-icon" 
        :style="getIconColor(item.flag.status)" @click="handleStatusClick(item)"
      />
    </template>
  </k-item>
</template>

<script setup>
import { usePanel } from 'kirbyuse';
import { computed } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  image: {
    type: Object,
    default: () => ({
      back: 'pattern',
      color: 'gray-500',
      icon: 'page'
    })
  }
});

const panel = usePanel();
const normalizedImage = computed(() => ({
  ...(props.item.image
    ? { src: props.item.image, cover: true, back: 'pattern', ratio: '1/1' }
    : { back: 'pattern', color: 'gray-500', icon: 'page' }),
  ...props.image
}));

function handleStatusClick(item) {
  panel.dialog.open(`pages/${item.path}/changeStatus`);
}

function getIconColor(status) {
  return status === 'listed' ? 'color: var(--color-green-500)' : 'color: var(--color-blue-500)';
}
</script>

<style scoped>
.k-draggable-item {
  width: 100%;
}

.k-status-icon {
  --icon-size: 15px;
}
</style>