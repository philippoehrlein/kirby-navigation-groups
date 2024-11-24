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
      class="k-draggable-container"
      :options="{ 
        group: {
          name: 'pages',
          pull: true,
          put: true
        },
        animation: 150
      }"
      @change="onDragChange">
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
  name: 'NavigationRoot',
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
              label: this.$t('field.navigationgroups.group.name'),
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
            text: this.$t('field.navigationgroups.group.delete.confirm', { name: group.text })
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
      const response = await this.$api.get(`navigation-groups/pages?path=${this.path}`);
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
    onDragChange(evt) {
      if (evt.from === evt.to) {
        this.$emit('input', this.value);
        return;
      }

      const movedItem = evt.item.__vue__.$props.item;
      const newValue = [...this.value];

      if (!evt.from.classList.contains('k-draggable-group') && 
          evt.to.classList.contains('k-draggable-group')) {
        
        // Finde die Zielgruppe
        const targetGroupIndex = newValue.findIndex(item => 
          item.type === 'group' && 
          item.pages === evt.to.__vue__.$props.list
        );

        if (targetGroupIndex !== -1) {
          // Entferne das Element aus Root
          const rootItemIndex = newValue.findIndex(item => item.uuid === movedItem.uuid);
          if (rootItemIndex !== -1) {
            newValue.splice(rootItemIndex, 1);
          }

          // Füge das Element zur Zielgruppe hinzu
          const pageItem = {
            type: 'page',
            ...movedItem
          };
          newValue[targetGroupIndex].pages.splice(evt.newIndex, 0, pageItem);
        }
      }

      this.$emit('input', newValue);
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