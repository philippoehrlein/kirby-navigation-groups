<template>
  <div class="k-navigation-group">
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
    <header class="k-navigation-group-header">
      <div class="k-navigation-group-header-title">
        <k-button variant="ghost" :icon="value.open ? 'angle-down' : 'angle-right'" :title="$t(value.open ? 'field.navigationgroups.closeGroup' : 'field.navigationgroups.openGroup')" @click="toggleGroup" />
        <h3>{{ value.title }}</h3>
      </div>
      <div class="k-navigation-group-header-options" @mousedown.stop>
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
      v-if="value.open"
      :list="value.pages" 
      :class="{ 'k-empty': !value.pages.length }"
      handle=".k-item-sort-handle"
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
        <PageItem :item="page" :image="image" />
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
    },
    fields: {
      type: Object,
      default: () => ({})
    },
    image: {
      type: Object,
      default: () => ({})
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
    },
    onGroupOption(action) {
      this.$emit(action);
    },
    toggleGroup() {
      this.$emit('input', {
        ...this.value,
        open: !this.value.open
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
  position: relative;
}
.k-item-sort-handle {
  position: absolute;
  top: 0;
  left: -28px;
  top: 4px;
  opacity: 0;
  transition: opacity 0s ease-in-out 0.15s;
}
.k-navigation-group:hover .k-item-sort-handle {
  opacity: 1;
}
.k-navigation-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-gray-200);
  padding: 0 var(--spacing-1);
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
  padding: var(--spacing-2) 0;
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