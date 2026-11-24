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
      <k-box v-for="item in value" :key="item.uuid || item.id" :data-navigation-item="item.type">
        <GroupItem 
          v-if="item.type === 'group'" 
          :value="item" 
          :image="image"
          @input="updateGroup"
          @edit="onGroupOption('edit', item)"
          @delete="onGroupOption('delete', item)"
        /> 
        <PageItem v-else :item="item" :image="image" />
      </k-box>
    </k-draggable>
  </section>
</template>

<script setup>
import { useApi, useHelpers, usePanel, usePanelEvent } from 'kirbyuse';
import { computed } from 'vue';
import PageItem from './PageItem.vue';
import GroupItem from './GroupItem.vue';

const props = defineProps({
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
    default: () => ({})
  },
  status: {
    type: String,
    default: 'listed'
  }
});
const emit = defineEmits(['input']);

const panel = usePanel();
const api = useApi();
const helpers = useHelpers();

const shouldClose = computed(() => {
  const groups = props.value.filter(item => item.type === 'group');
  const openCount = groups.filter(group => group.open).length;
  return openCount >= groups.length / 2;
});
const toggleAllIcon = computed(() => shouldClose.value ? 'angle-down' : 'angle-right');
const toggleAllTooltip = computed(() => panel.t(shouldClose.value
  ? 'field.navigationgroups.closeAll'
  : 'field.navigationgroups.openAll'
));

function openDialog(option, group) {
  const fields = props.fields || {};

  panel.dialog.open({
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
          emit("input", [...props.value, {
            uuid: helpers.string.uuid(),
            type: "group",
            title: value.title,
            open: true,
            ...value,
            pages: []
          }]);
        } else {
          emit("input", props.value.map(item =>
            item.uuid === group.uuid ? {
              ...item,
              ...value
            } : item
          ));
        }
        panel.dialog.close();
      }
    }
  });
}

function addGroup() {
  openDialog('add');
}

function onRootChange() {
  emit('input', props.value);
}

function onGroupOption(option, group) {
  if (option === 'edit') {
    openDialog('edit', group);
  } else {
    panel.dialog.open({
      component: 'k-remove-dialog',
      props: {
        text: panel.t('field.navigationgroups.group.delete.confirm', { name: group.title })
      },
      on: {
        submit: () => {
          deleteGroup(group);
          panel.dialog.close();
        }
      }
    })
  }
}

function deleteGroup(group) {
  if(group.pages.length) {
    const newValue = [...props.value];
    const groupIndex = newValue.findIndex(item => item.uuid === group.uuid);

    newValue.splice(groupIndex, 1, ...group.pages.map(page => ({
      type: 'page',
      ...page
    })));

    emit('input', newValue);
    return;
  }

  emit('input', props.value.filter(item =>
    item.uuid !== group.uuid ? item : null
  ));
}

async function loadPages() {
  const path = props.path === undefined ? 'site' : props.path;
  const response = await api.get(`navigation-groups/pages?path=${path}&status=${props.status}`);
  const newValue = props.value.map(item => ({ ...item }));

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
    } else if (item.type === 'group' && item.pages && item.pages.length) {
      const updatedPages = item.pages
        .map(page => {
          const matchingPage = response.find(p => p.id === page.id);
          if (matchingPage) {
            return {
              ...page,
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
          return null;
        })
        .filter(Boolean);
      newValue[i] = { ...item, pages: updatedPages };
    }
  }

  const existingPageIds = new Set(
    newValue.flatMap(item =>
      item.type === 'page'
        ? [item.id]
        : (item.pages || []).map(page => page.id)
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

  emit('input', newValue);
}

function updateGroup(updatedGroup) {
  const newValue = [...props.value];
  const groupIndex = newValue.findIndex(item => item.uuid === updatedGroup.uuid);

  if (groupIndex !== -1) {
    newValue[groupIndex] = {
      ...newValue[groupIndex],
      ...updatedGroup
    };
  }

  emit('input', newValue);
}

function toggleAll() {
  const newValue = props.value.map(item => {
    if (item.type === 'group') {
      return {
        ...item,
        open: !shouldClose.value
      };
    }
    return item;
  });

  emit('input', newValue);
}

usePanelEvent('page.changeStatus', loadPages);
loadPages();
</script>

<style scoped>
.k-draggable-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  padding: 0 0 var(--spacing-2) 0;
}
</style>
