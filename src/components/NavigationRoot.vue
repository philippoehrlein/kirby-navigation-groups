<template>
  <section class="k-section">
    <header class="k-section-header">
      <h2 class="k-label k-section-label">
        <span class="k-label-text">{{ label }}</span>
      </h2>
      <div class="k-button-group k-section-buttons">
        <k-button variant="filled" size="xs" :icon="toggleAllIcon" :title="toggleAllTooltip" @click="toggleAll" />
        <k-button variant="filled" size="xs" icon="addgroup" :title="$t('field.navigationgroups.addGroup')" @click="addGroup" />
      </div>
    </header>
    <k-empty v-if="!value.length" icon="page" :text="$t('pages.empty')" />
    <k-draggable
      :list="value"
      class="k-draggable-container"
      handle=".k-item-sort-handle"
      :options="{ 
        group: {
          name: 'pages',
          pull: true,
          put: true
        },
        animation: 150
      }"
      @change="onRootChange">
      <k-box v-for="(item, index) in value" :key="item.id">
        <GroupItem 
          v-if="item.type === 'group'" 
          :value="item" 
          :fields="fields"
          :image="image"
          @input="updateGroup(index, $event)"
          @edit="onGroupOption('edit', item)"
          @delete="onGroupOption('delete', item)"
        /> 
        <PageItem v-else :item="item" :image="image" />
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
    },
    image: {
      type: Object,
      default: () => ({})
    },
    fields: {
      type: Object,
      default: () => {}
    },
    status: {
      type: String,
      default: 'listed'
    }
  },
  data() {
    return {
      pages: this.value || [],
      draggedElement: null,
      isDragging: false
    };
  },
  created() {
    this.loadPages();
  },
  mounted() {
		this.$events.on("page.changeStatus", this.loadPages);
	},
	destroyed() {
		this.$events.off("page.changeStatus", this.loadPages);
	},
  computed: {
    groupStats() {
      const groups = this.value.filter(item => item.type === 'group');
      const openCount = groups.filter(group => group.open).length;
      const totalCount = groups.length;
      
      return {
        openCount,
        closedCount: totalCount - openCount,
        totalCount,
        shouldClose: openCount >= totalCount / 2
      };
    },

    toggleAllIcon() {
      return this.groupStats.shouldClose ? 'angle-down' : 'angle-right';
    },

    toggleAllTooltip() {
      return this.groupStats.shouldClose 
        ? this.$t('field.navigationgroups.closeAll') 
        : this.$t('field.navigationgroups.openAll');
    }
  },
  methods: {
    openDialog(option, group) {
      const fields = this.fields || {};
      
      this.$panel.dialog.open({
        component: "k-form-dialog",
        props: {
          fields,
          value: option === "add" ? {} : {
            title: group.title,
            ...group
          }
        },
        on: {
          submit: (value) => {
            if (option === "add") {
              this.$emit("input", [...this.value, {
                uuid: this.$helper.string.uuid(),
                type: "group",
                title: value.title,
                open: true,
                ...value,
                pages: []
              }]);
            } else {
              this.$emit("input", this.value.map(item => 
                item.uuid === group.uuid ? {
                  ...item,
                  ...value
                } : item
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
    onRootChange(evt) {
      this.$emit('input', this.value);
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
        const newValue = [...this.value];
        const groupIndex = newValue.findIndex(item => item.uuid === group.uuid);
        
        newValue.splice(groupIndex, 1, ...group.pages.map(page => ({
          type: 'page',
          ...page
        })));
        
        this.$emit('input', newValue);
        return;
      } 
      
      this.$emit('input', this.value.filter(item => 
        item.uuid !== group.uuid ? item : null
      ));
    },
    async loadPages() {
      const path = this.path === undefined ? 'site' : this.path;      
      const response = await this.$api.get(`navigation-groups/pages?path=${path}&status=${this.status}`);

      const newValue = [...this.value];

      for (let i = newValue.length - 1; i >= 0; i--) {
        const item = newValue[i];

        if (item.type === 'page') {
          const matchingPage = response.find(page => page.id === item.id);
          if (!matchingPage) {
            newValue.splice(i, 1);
          } else {
            newValue[i] = {
              ...item,
              text: matchingPage.title,
              path: matchingPage.path.replace(/\//g, '+'),
              image: matchingPage.image || null,
              flag: {
                status: matchingPage.status,
                icon: 'icon-status-' + matchingPage.status,
                disabled: !matchingPage.permissions?.changeStatus,
                statusId: matchingPage.id
              }
            };
          }
        } else if (item.type === 'group' && item.pages.length) {
          item.pages = item.pages.map(page => {
            const matchingPage = response.find(p => p.id === page.id);
            if (matchingPage) {
              const newPath = matchingPage.path.replace(/\//g, '+');
              return {
                ...page,
                text: matchingPage.title,
                path: newPath,
                image: matchingPage.image || null,
                flag: {
                  status: matchingPage.status,
                  icon: 'icon-status-' + matchingPage.status,
                  disabled: !matchingPage.permissions?.changeStatus,
                  statusId: matchingPage.id
                }
              };
            }
            return null;
          }).filter(Boolean);
        }
      }

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
          path: page.path.replace(/\//g, '+'),
          text: page.title,
          uuid: page.uuid,
          sortable: true,
          image: page.image || null,
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
      const groupIndex = newValue.findIndex(item => item.uuid === updatedGroup.uuid);
      
      if (groupIndex !== -1) {
        newValue[groupIndex] = {
          ...newValue[groupIndex],
          ...updatedGroup
        };
      }
      
      this.$emit('input', newValue);
    },
    toggleAll() {
      const newValue = this.value.map(item => {
        if (item.type === 'group') {
          return {
            ...item,
            open: !this.groupStats.shouldClose
          };
        }
        return item;
      });
      
      this.$emit('input', newValue);
    }
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