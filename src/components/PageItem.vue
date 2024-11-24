<template>
  <k-item 
    v-if="item.type === 'page'"
    :sortable="item.sortable" 
    :text="item.text" 
    :link="'pages/' + item.path"
    :image="{'back': 'pattern', color: 'white', 'icon':'page'}"
    class="k-draggable-item">
    <template #options>
      <k-button 
        icon="status-listed" 
        data-type="status-listed" 
        data-theme="positive-icon" 
        class="k-button k-status-icon" 
        style="--icon-size: 15px; color: var(--color-green-500)" @click="handleStatusClick(item)"
      />
    </template>
  </k-item>
</template>

<script>
export default {
  name: 'SidebarPageItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleStatusClick(item) {
      this.$dialog(`pages/${item.path}/changeStatus`);
    }
  }
}
</script>

<style scoped>
.k-draggable-item {
  width: 100%;
}
</style>