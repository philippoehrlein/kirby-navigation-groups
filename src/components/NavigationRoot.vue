<template>
  <section class="k-section">
    <header class="k-section-header">
      <h2 class="k-label k-section-label">
        <span class="k-label-text">{{ label }}</span>
      </h2>
      <div class="k-button-group k-section-buttons">
        <k-button variant="filled" size="xs" icon="addgroup" @click="addGroup" />
      </div>
    </header>
    <k-empty v-if="!value.length" icon="page" :text="$t('pages.empty')" />
    <k-draggable
      :list="value"
      :options="{ 
        group: { 
          name: 'root',
          pull: true,
          put: (to, from) => {
            return from.options.group.name === 'pages';
          }
        },
        animation: 150
      }"
      class="k-draggable-container"
      @change="onDragChange"
      @dragstart="onDragStart">
      <k-box v-for="(item, index) in value" :key="item.id">
        <GroupItem 
          v-if="item.type === 'group'" 
          :value="item" 
          @input="updateGroup(index, $event)"
          @edit="onGroupOption('edit', item)"
          @delete="onGroupOption('delete', item)"
        /> 
        <PageItem v-else :item="item" />
      </k-box>
    </k-draggable>
  </section>
</template>

<script>
import PageItem from './PageItem.vue';
import GroupItem from './GroupItem.vue';

export default {
  name: 'SidebarNavigation',
  components: {
    PageItem,
    GroupItem
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    path: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      pages: this.value || [],
      draggedElement: null,
      isDragging: false
    };
  },
  methods: {
    openDialog(option, group) {
      this.$panel.dialog.open({
        component: 'k-form-dialog',
        props: {
          fields: {
            title: {
              label: this.$t('field.sidebarnavigation.group.name'),
              required: true,
              type: 'text'
            }
          },
          value: {
            title: option === 'add' ? '' : group.text
          }
        },
        on: {
          submit: (value) => {
            if (option === 'add') {
              this.$emit('input', [...this.value, {
                uuid: this.$helper.string.uuid(),
                type: 'group',
                text: value.title,
                pages: []
              }]);
            } else {
              this.$emit('input', this.value.map(item => 
                item.uuid === group.uuid ? { ...item, text: value.title } : item
              ));
            }
            this.$panel.dialog.close();
          }
        }
      });
    },
    addGroup() {
      this.openDialog('add');
    },
    onGroupOption(option, group) {
      if (option === 'edit') {
        this.openDialog('edit', group);
      } else {
        this.$panel.dialog.open({
          component: 'k-remove-dialog',
          props: {
            text: this.$t('field.sidebarnavigation.group.delete.confirm', { name: group.text })
          },
          on: {
            submit: () => {
              this.deleteGroup(group);
              this.$panel.dialog.close();
            }
          }
        })
      }
    },
    deleteGroup(group) {
      if(group.pages.length) {
        this.$emit('input', [
          ...this.value.filter(item => item.uuid !== group.uuid),
          ...group.pages.map(page => ({
          type: 'page',
          ...page
        }))
        ]);
        return;
      } 
      this.$emit('input', this.value.filter(item => 
        item.uuid !== group.uuid ? item : null
      ));
    },
    async loadPages() {
      const response = await this.$api.get(`sidebar-navigation/pages?path=${this.path}`);
      const newValue = [...this.value];

      for (let i = newValue.length - 1; i >= 0; i--) {
        const item = newValue[i];

        if (item.type === 'page') {
          const pageExists = response.some(page => page.id === item.id);
          if (!pageExists) {
            newValue.splice(i, 1);
          }
        } else if (item.type === 'group' && item.pages.length) {
          item.pages = item.pages.filter(page =>
            response.some(availablePage => availablePage.id === page.id)
          );
        }
      }

      // Füge neue Seiten hinzu
      const existingPageIds = new Set(
        newValue.flatMap(item =>
          item.type === 'page'
            ? [item.id]
            : item.pages.map(page => page.id)
        )
      );

      const newPages = response
        .filter(page => !existingPageIds.has(page.id))
        .map(page => ({
          type: 'page',
          id: page.id,
          path: page.path.replace('/', '+'),
          text: page.title,
          uuid: page.uuid,
          sortable: true,
          flag: {
            status: page.status,
            icon: 'icon-status-' + page.status,
            disabled: !page.permissions?.changeStatus,
            statusId: page.id
          }
        }));
      newValue.push(...newPages);

      this.$emit('input', newValue);
      this.pages = response;
    },
    updateGroup(index, updatedGroup) {
      const newValue = [...this.value];
      newValue[index] = {
        ...newValue[index],
        pages: updatedGroup.pages
      };
      this.$emit('input', newValue);
    },
    removePage(groupIndex, pageIndex) {
      const newValue = [...this.value];
      const page = newValue[groupIndex].pages.splice(pageIndex, 1)[0];
      newValue.push(page);
      this.$emit('input', newValue);
    },
    onDragChange(evt) {
      if (evt.removed) {
        const { element } = evt.removed;
        if (element && element.type === 'page') {
          this.removeElementFromCurrentLocation(element);
        }
      }

      if (evt.added) {
        const { element, newIndex } = evt.added;
        const isInRoot = this.value.some(item => item.id === element.id);
        if (element && element.type === 'page' && !isInRoot) {
          this.addElementToNewLocation(element, newIndex);
        }
      }

      this.$emit('input', this.value);
    },
    removeElementFromCurrentLocation(element) {
      const index = this.value.findIndex(item => item.id === element.id);
      if (index !== -1) {
        this.value.splice(index, 1);
      }
    },
    addElementToNewLocation(element, newIndex) {
      this.value.splice(newIndex, 0, element);
    },
    onDragStart(evt) {
      // Speichere das aktuelle Element und seine Position
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
      
      const groupEl = document.elementFromPoint(evt.clientX, evt.clientY)
        ?.closest('.k-sidebar-group');
            
      if (groupEl) {
        const groupComponent = groupEl.__vue__;
        
        if (groupComponent && groupComponent.value.type === 'group') {
          this.$refs.rootDraggable.dragCancel();
          
          // Füge Element zur Gruppe hinzu
          this.moveElementToGroup(this.draggedElement, groupComponent.value);
          
          // Starte neuen Drag in Gruppe
          this.$nextTick(() => {
            const pageEl = groupEl.querySelector(`[data-id="${this.draggedElement.id}"]`);
            if (pageEl) {
              pageEl.__vue__.$refs.draggable.dragStart(evt);
            }
          });
        }
      }
    },

    stopTracking() {
      this.isDragging = false;
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('mouseup', this.stopTracking);
    }
  },
  created() {
    this.loadPages();
  }
};
</script>

<style scoped>
.k-draggable-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  padding: 0 0 var(--spacing-2) 0;
}
</style>