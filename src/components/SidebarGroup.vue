<template>
  <div class="k-sidebar-group">
    <header class="k-sidebar-group-header">
      <div class="k-sidebar-group-header-title">
        <button data-has-icon="true" aria-label="Bewegen um zu sortieren …" title="Bewegen um zu sortieren …" type="button" class="k-button k-sort-handle k-sort-button k-item-sort-handle" tabindex="-1"><span class="k-button-icon"><svg aria-hidden="true" data-type="sort" class="k-icon"><use xlink:href="#icon-sort"></use></svg></span><!----><!----></button>
        <h3>{{ value.text }}</h3>
      </div>
      <div class="k-sidebar-group-header-options">
        <k-options-dropdown :options="[{ text: $t('edit'), icon: 'edit', click: 'edit' }, { text: $t('delete'), icon: 'trash', click: 'delete' }]" @action="onGroupOption($event)" />
      </div>
    </header>
    <k-draggable 
      :list="value.pages" 
      :class="{ 'k-empty': !value.pages.length }"
      :animation="150"
      :options="{ 
        group: { 
          name: 'pages',
          pull: true,
          put: (to, from, dragEl) => {
            return dragEl.__vue__ && dragEl.__vue__.$children[0].$options.name === 'SidebarPageItem';
          }
        } 
      }"
      class="k-draggable-group"
      @change="onDragChange">
      <k-box v-for="page in value.pages" :key="page.id">
        <SidebarPageItem :item="page" />
      </k-box>
    </k-draggable>
    <footer class="k-sidebar-group-footer">
      
    </footer>
  </div>
</template>

<script>
import SidebarPageItem from './SidebarPageItem.vue';

export default {
  name: 'SidebarGroup',
  components: {
    SidebarPageItem
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  methods: {
    onDragChange(evt) {
      if (evt.removed) {
        const { element } = evt.removed;
        if (element && element.type === 'page') {
          this.removePageFromGroup(element);
        }
      }

      if (evt.added) {
        const { element, newIndex } = evt.added;
        if (element.type === 'page') {
          this.movePageWithinGroup(element, newIndex);
        }
      }

      this.$emit('input', {
        ...this.value,
        pages: this.value.pages
      });
    },
    removePageFromGroup(page) {
      const pageIndex = this.value.pages.findIndex(p => p.id === page.id);
      if (pageIndex !== -1) {
        this.value.pages.splice(pageIndex, 1);
      }
    },
    movePageWithinGroup(page, newIndex) {
      const currentIndex = this.value.pages.findIndex(p => p.id === page.id);
      if (currentIndex !== -1) {
        this.value.pages.splice(currentIndex, 1);
      }
      this.value.pages.splice(newIndex, 0, page);
    },
    onGroupOption(evt) {
      console.log(evt);
      if(evt === 'edit') {
        this.$emit('edit');
      } else if (evt === 'delete') {
        this.$emit('delete');
      }
    }
  },
  mounted() {
    console.log(this.value);
  }
}
</script>

<style scoped>
.k-sidebar-group {
  width: 100%;
  background-color: var(--color-white);
  border-radius: var(--rounded-md);
  box-shadow: var(--shadow);
}
.k-sidebar-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-gray-200);
  height: var(--height-xl);
}
.k-sidebar-group-header h3 {
  white-space: nowrap;
  overflow: hidden;
  font-size: var(--text-sm);
  line-height: 1.4;
  text-overflow: ellipsis;
}

.k-sidebar-group-header-title {
  display: flex;
  align-items: center;
  overflow: hidden;
  gap: var(--spacing-2);
}
.k-sidebar-group-footer {
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
  pointer-events: none;
  height: 40px;
  background-color: var(--color-gray-100);
}
</style>