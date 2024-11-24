<template>
  <div class="k-sidebar-group">
    <header class="k-sidebar-group-header">
      <div class="k-sidebar-group-header-title">
        <button 
          data-has-icon="true" 
          :aria-label="$t('field.sidebarnavigation.group.sort')" 
          :title="$t('field.sidebarnavigation.group.sort')" 
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
      <div class="k-sidebar-group-header-options">
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
              dragEl.__vue__.$children[0].$options.name === 'PageItem';
            return isPageItem;
          }
        },
        animation: 150
      }"
      class="k-draggable-group"
      @change="onDragChange"
      @dragstart="onDragStart">
      <k-box v-for="page in value.pages" :key="page.id">
        <PageItem :item="page" />
      </k-box>
    </k-draggable>
    <footer class="k-sidebar-group-footer">
      
    </footer>
  </div>
</template>

<script>
import PageItem from './PageItem.vue';

export default {
  name: 'SidebarGroup',
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
      if(evt === 'edit') {
        this.$emit('edit');
      } else if (evt === 'delete') {
        this.$emit('delete');
      }
    },
    onDragStart(evt) {
      this.draggedElement = evt.item.__vue__.$children[0].item;
      this.isDragging = true;
      this.trackMousePosition();
    },
    trackMousePosition() {
      window.addEventListener('mousemove', this.handleMouseMove);
      window.addEventListener('mouseup', this.stopTracking);
    },
    handleMouseMove(evt) {
      if (!this.isDragging) return;
      
      const elementUnderMouse = document.elementFromPoint(evt.clientX, evt.clientY);
      const isOverRoot = elementUnderMouse?.closest('.k-draggable-container');
      
      if (isOverRoot && !elementUnderMouse?.closest('.k-sidebar-group')) {
        this.$refs.groupDraggable.$el.dispatchEvent(new MouseEvent('mouseup'));
        
        // Verschiebe Element ins Root
        this.$emit('moveToRoot', this.draggedElement);
        
        // Starte neuen Drag im Root
        this.$nextTick(() => {
          const pageEl = isOverRoot.querySelector(`[data-id="${this.draggedElement.id}"]`);
          if (pageEl) {
            const event = new MouseEvent('mousedown', {
              clientX: evt.clientX,
              clientY: evt.clientY
            });
            pageEl.dispatchEvent(event);
          }
        });
      }
    },
    stopTracking() {
      this.isDragging = false;
      this.draggedElement = null;
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('mouseup', this.stopTracking);
    }
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
  height: 40px;
  background-color: var(--color-gray-100);
}
</style>