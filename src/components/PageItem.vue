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

<script>
export default {
  name: 'NavigationPageItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    image: {
      type: Object,
      default: () => ({
        'back': 'pattern',
        'color': 'gray-500',
        'icon': 'page'
      })
    }
  },
  computed: {
    normalizedImage() {
      if(this.item.image) {
        return {
          src: this.item.image,
          cover: true,
          back: 'pattern',
          ratio: '1/1',
          ...this.image
        }
      } else {
        return {
          back: 'pattern',
          color: 'gray-500',
          icon: 'page',
          ...this.image
        }
      }
      
    }
  },
  methods: {
    handleStatusClick(item) {
      this.$dialog(`pages/${item.path}/changeStatus`);
    },
    getIconColor(status) {
      return status === 'listed' ? 'color: var(--color-green-500)' : 'color: var(--color-blue-500)';
    }
  }
}
</script>

<style scoped>
.k-draggable-item {
  width: 100%;
}

.k-status-icon {
  --icon-size: 15px;
}

.k-frame.k-icon-frame.k-item-image svg {
  color: var(--color-grey-500);
}
</style>