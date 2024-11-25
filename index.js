(function() {
  "use strict";
  function normalizeComponent(scriptExports, render, staticRenderFns, functionalTemplate, injectStyles, scopeId, moduleIdentifier, shadowMode) {
    var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;
    if (render) {
      options.render = render;
      options.staticRenderFns = staticRenderFns;
      options._compiled = true;
    }
    if (scopeId) {
      options._scopeId = "data-v-" + scopeId;
    }
    return {
      exports: scriptExports,
      options
    };
  }
  const _sfc_main$2 = {
    name: "NavigationPageItem",
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    methods: {
      handleStatusClick(item) {
        this.$dialog(`pages/${item.path}/changeStatus`);
      },
      getIconColor(status) {
        console.log(status);
        return status === "listed" ? "color: var(--color-green-500)" : "color: var(--color-blue-500)";
      }
    }
  };
  var _sfc_render$2 = function render() {
    var _vm = this, _c = _vm._self._c;
    return _vm.item.type === "page" ? _c("k-item", { staticClass: "k-draggable-item", attrs: { "sortable": _vm.item.sortable, "text": _vm.item.text, "link": "pages/" + _vm.item.path, "image": { "back": "pattern", color: "gray-500", "icon": "page" } }, scopedSlots: _vm._u([{ key: "drag", fn: function() {
      return [_vm.item.sortable ? _c("k-drag-handle") : _vm._e()];
    }, proxy: true }, { key: "options", fn: function() {
      return [_c("k-button", { staticClass: "k-button k-status-icon", style: _vm.getIconColor(_vm.item.flag.status), attrs: { "icon": "status-" + _vm.item.flag.status, "data-type": "status-" + _vm.item.flag.status, "data-theme": _vm.item.flag.status === "listed" ? "positive-icon" : "info-icon" }, on: { "click": function($event) {
        return _vm.handleStatusClick(_vm.item);
      } } })];
    }, proxy: true }], null, false, 2125919631) }) : _vm._e();
  };
  var _sfc_staticRenderFns$2 = [];
  _sfc_render$2._withStripped = true;
  var __component__$2 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$2,
    _sfc_render$2,
    _sfc_staticRenderFns$2,
    false,
    null,
    "52320cd5"
  );
  __component__$2.options.__file = "/Users/philipp/Documents/02_Offen/Kirby Plugins/email-manager-landing/site/plugins/kirby-navigation-groups/src/components/PageItem.vue";
  const PageItem = __component__$2.exports;
  const _sfc_main$1 = {
    name: "NavigationGroup",
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
      }
    },
    data() {
      return {
        draggedElement: null,
        isDragging: false
      };
    },
    methods: {
      onDragChange(evt) {
        this.$emit("input", {
          ...this.value,
          pages: this.value.pages
        });
      },
      onGroupOption(action) {
        this.$emit(action);
      }
    }
  };
  var _sfc_render$1 = function render() {
    var _vm = this, _c = _vm._self._c;
    return _c("div", { staticClass: "k-navigation-group" }, [_c("header", { staticClass: "k-navigation-group-header" }, [_c("div", { staticClass: "k-navigation-group-header-title" }, [_c("button", { staticClass: "k-button k-sort-handle k-sort-button k-item-sort-handle", attrs: { "data-has-icon": "true", "aria-label": _vm.$t("field.navigationgroups.group.sort"), "title": _vm.$t("field.navigationgroups.group.sort"), "type": "button", "tabindex": "-1" } }, [_c("span", { staticClass: "k-button-icon" }, [_c("svg", { staticClass: "k-icon", attrs: { "aria-hidden": "true", "data-type": "sort" } }, [_c("use", { attrs: { "xlink:href": "#icon-sort" } })])])]), _c("h3", [_vm._v(_vm._s(_vm.value.title))])]), _c("div", { staticClass: "k-navigation-group-header-options" }, [_c("k-options-dropdown", { attrs: { "options": [
      { text: _vm.$t("edit"), icon: "edit", click: "edit" },
      { text: _vm.$t("delete"), icon: "trash", click: "delete" }
    ] }, on: { "action": function($event) {
      return _vm.onGroupOption($event);
    } } })], 1)]), _c("k-draggable", { ref: "groupDraggable", staticClass: "k-draggable-group", class: { "k-empty": !_vm.value.pages.length }, attrs: { "list": _vm.value.pages, "options": {
      group: {
        name: "pages",
        pull: true,
        put: (to, from, dragEl) => {
          const isPageItem = dragEl.__vue__ && dragEl.__vue__.$children[0] && dragEl.__vue__.$children[0].$options.name === "NavigationPageItem";
          const isGroup = dragEl.__vue__ && dragEl.__vue__.$children[0] && dragEl.__vue__.$children[0].$options.name === "NavigationGroup";
          return isPageItem && !isGroup;
        }
      },
      animation: 150
    } }, on: { "change": _vm.onDragChange } }, _vm._l(_vm.value.pages, function(page) {
      return _c("k-box", { key: page.id }, [_c("PageItem", { attrs: { "item": page } })], 1);
    }), 1), _c("footer", { staticClass: "k-navigation-group-footer" })], 1);
  };
  var _sfc_staticRenderFns$1 = [];
  _sfc_render$1._withStripped = true;
  var __component__$1 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$1,
    _sfc_render$1,
    _sfc_staticRenderFns$1,
    false,
    null,
    "aaefb2ee"
  );
  __component__$1.options.__file = "/Users/philipp/Documents/02_Offen/Kirby Plugins/email-manager-landing/site/plugins/kirby-navigation-groups/src/components/GroupItem.vue";
  const GroupItem = __component__$1.exports;
  const _sfc_main = {
    name: "NavigationRoot",
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
      fields: {
        type: Object,
        default: () => {
        }
      },
      status: {
        type: String,
        default: "listed"
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
                  ...value,
                  pages: []
                }]);
              } else {
                this.$emit("input", this.value.map(
                  (item) => item.uuid === group.uuid ? {
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
        this.openDialog("add");
      },
      onGroupOption(option, group) {
        if (option === "edit") {
          this.openDialog("edit", group);
        } else {
          this.$panel.dialog.open({
            component: "k-remove-dialog",
            props: {
              text: this.$t("field.navigationgroups.group.delete.confirm", { name: group.text })
            },
            on: {
              submit: () => {
                this.deleteGroup(group);
                this.$panel.dialog.close();
              }
            }
          });
        }
      },
      deleteGroup(group) {
        if (group.pages.length) {
          this.$emit("input", [
            ...this.value.filter((item) => item.uuid !== group.uuid),
            ...group.pages.map((page) => ({
              type: "page",
              ...page
            }))
          ]);
          return;
        }
        this.$emit("input", this.value.filter(
          (item) => item.uuid !== group.uuid ? item : null
        ));
      },
      async loadPages() {
        const response = await this.$api.get(`navigation-groups/pages?path=${this.path}&status=${this.status}`);
        const newValue = [...this.value];
        for (let i = newValue.length - 1; i >= 0; i--) {
          const item = newValue[i];
          if (item.type === "page") {
            const pageExists = response.some((page) => page.id === item.id);
            if (!pageExists) {
              newValue.splice(i, 1);
            }
          } else if (item.type === "group" && item.pages.length) {
            item.pages = item.pages.filter(
              (page) => response.some((availablePage) => availablePage.id === page.id)
            );
          }
        }
        const existingPageIds = new Set(
          newValue.flatMap(
            (item) => item.type === "page" ? [item.id] : item.pages.map((page) => page.id)
          )
        );
        const newPages = response.filter((page) => !existingPageIds.has(page.id)).map((page) => {
          var _a;
          return {
            type: "page",
            id: page.id,
            path: page.path.replace("/", "+"),
            text: page.title,
            uuid: page.uuid,
            sortable: true,
            flag: {
              status: page.status,
              icon: "icon-status-" + page.status,
              disabled: !((_a = page.permissions) == null ? void 0 : _a.changeStatus),
              statusId: page.id
            }
          };
        });
        newValue.push(...newPages);
        this.$emit("input", newValue);
        this.pages = response;
      },
      updateGroup(index, updatedGroup) {
        const newValue = [...this.value];
        newValue[index] = {
          ...newValue[index],
          pages: updatedGroup.pages
        };
        this.$emit("input", newValue);
      },
      onDragChange(evt) {
        if (evt.from === evt.to) {
          this.$emit("input", this.value);
          return;
        }
        const movedItem = evt.item.__vue__.$props.item;
        const newValue = [...this.value];
        if (!evt.from.classList.contains("k-draggable-group") && evt.to.classList.contains("k-draggable-group")) {
          const targetGroupIndex = newValue.findIndex(
            (item) => item.type === "group" && item.pages === evt.to.__vue__.$props.list
          );
          if (targetGroupIndex !== -1) {
            const rootItemIndex = newValue.findIndex((item) => item.uuid === movedItem.uuid);
            if (rootItemIndex !== -1) {
              newValue.splice(rootItemIndex, 1);
            }
            const pageItem = {
              type: "page",
              ...movedItem
            };
            newValue[targetGroupIndex].pages.splice(evt.newIndex, 0, pageItem);
          }
        }
        this.$emit("input", newValue);
      }
    },
    created() {
      this.loadPages();
    }
  };
  var _sfc_render = function render() {
    var _vm = this, _c = _vm._self._c;
    return _c("section", { staticClass: "k-section" }, [_c("header", { staticClass: "k-section-header" }, [_c("h2", { staticClass: "k-label k-section-label" }, [_c("span", { staticClass: "k-label-text" }, [_vm._v(_vm._s(_vm.label))])]), _c("div", { staticClass: "k-button-group k-section-buttons" }, [_c("k-button", { attrs: { "variant": "filled", "size": "xs", "icon": "addgroup" }, on: { "click": _vm.addGroup } })], 1)]), !_vm.value.length ? _c("k-empty", { attrs: { "icon": "page", "text": _vm.$t("pages.empty") } }) : _vm._e(), _c("k-draggable", { staticClass: "k-draggable-container", attrs: { "list": _vm.value, "options": {
      group: {
        name: "pages",
        pull: true,
        put: true
      },
      animation: 150
    } }, on: { "change": _vm.onDragChange } }, _vm._l(_vm.value, function(item, index) {
      return _c("k-box", { key: item.id }, [item.type === "group" ? _c("GroupItem", { attrs: { "value": item, "fields": _vm.fields }, on: { "input": function($event) {
        return _vm.updateGroup(index, $event);
      }, "edit": function($event) {
        return _vm.onGroupOption("edit", item);
      }, "delete": function($event) {
        return _vm.onGroupOption("delete", item);
      } } }) : _c("PageItem", { attrs: { "item": item } })], 1);
    }), 1)], 1);
  };
  var _sfc_staticRenderFns = [];
  _sfc_render._withStripped = true;
  var __component__ = /* @__PURE__ */ normalizeComponent(
    _sfc_main,
    _sfc_render,
    _sfc_staticRenderFns,
    false,
    null,
    "099cc128"
  );
  __component__.options.__file = "/Users/philipp/Documents/02_Offen/Kirby Plugins/email-manager-landing/site/plugins/kirby-navigation-groups/src/components/NavigationRoot.vue";
  const NavigationRoot = __component__.exports;
  panel.plugin("philippoehrlein/kirby-navigation-groups", {
    icons: {
      "addgroup": '<path d="M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM5 5V19H19V5H5ZM11 11V7H13V11H17V13H13V17H11V13H7V11H11Z"></path>'
    },
    fields: {
      navigationgroups: NavigationRoot
    }
  });
})();
