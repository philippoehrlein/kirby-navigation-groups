<template>
  <div class="k-navigation-group">
    <header class="k-navigation-group-header">
      <div class="k-navigation-group-header-title">
        <button 
          data-has-icon="true" 
          :aria-label="$t('field.navigationgroups.group.sort')" 
          :title="$t('field.navigationgroups.group.sort')" 
          type="button" 
          class="k-button k-sort-handle k-sort-button k-item-sort-handle" 
          tabindex="-1"
        >
          <span class="k-button-icon">
            <svg aria-hidden="true" data-type="sort" class="k-icon">
              <use xlink:href="#icon-sort"></use>
            </svg>
          </span>
        </button>
        <h3>{{ value.text }}</h3>
      </div>
      <div class="k-navigation-group-header-options">
        <k-options-dropdown 
          :options="[
            { text: $t('edit'), icon: 'edit', click: 'edit' }, 
            { text: $t('delete'), icon: 'trash', click: 'delete' }
          ]" 
          @action="onGroupOption($event)" 
        />
      </div>
    </header>
    <k-draggable 
      ref="groupDraggable"
      :list="value.pages" 
      :class="{ 'k-empty': !value.pages.length }"
      :options="{ 
        group: { 
          name: 'pages',
          pull: true,
          put: (to, from, dragEl) => {
            const isPageItem = dragEl.__vue__ && 
              dragEl.__vue__.$children[0] && 
              dragEl.__vue__.$children[0].$options.name === 'NavigationPageItem';
            
            const isGroup = dragEl.__vue__ && 
              dragEl.__vue__.$children[0] && 
              dragEl.__vue__.$children[0].$options.name === 'NavigationGroup';
            
            return isPageItem && !isGroup;
          }
        },
        animation: 150
      }"
      class="k-draggable-group"
      @change="onDragChange">
      <k-box v-for="page in value.pages" :key="page.id">
        <PageItem :item="page" />
      </k-box>
    </k-draggable>
    <footer class="k-navigation-group-footer">
      
    </footer>
  </div>
</template>

<script>
import PageItem from './PageItem.vue';

export default {
  name: 'NavigationGroup',
  components: {
    PageItem
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      draggedElement: null,
      isDragging: false
    }
  },
  methods: {
    onDragChange(evt) {
      this.$emit('input', {
        ...this.value,
        pages: this.value.pages
      });
    }
  }
}
</script>

<style scoped>
.k-navigation-group {
  width: 100%;
  background-color: var(--color-white);
  border-radius: var(--rounded-md);
  box-shadow: var(--shadow);
}
.k-navigation-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-gray-200);
  height: var(--height-xl);
}
.k-navigation-group-header h3 {
  white-space: nowrap;
  overflow: hidden;
  font-size: var(--text-sm);
  line-height: 1.4;
  text-overflow: ellipsis;
}

.k-navigation-group-header-title {
  display: flex;
  align-items: center;
  overflow: hidden;
  gap: var(--spacing-2);
}
.k-navigation-group-footer {
  border-top: 1px solid var(--color-gray-200);
  padding: var(--spacing-1);
}
.k-draggable-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  background-color: var(--color-gray-100);
  padding: var(--spacing-2) var(--spacing-1);
}
.k-empty {
  height: 40px;
  background-color: var(--color-gray-100);
}
</style>