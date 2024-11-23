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
    name: "SidebarPageItem",
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
  };
  var _sfc_render$2 = function render() {
    var _vm = this, _c = _vm._self._c;
    return _vm.item.type === "page" ? _c("k-item", { staticClass: "k-draggable-item", attrs: { "sortable": _vm.item.sortable, "text": _vm.item.text, "link": "pages/" + _vm.item.path, "image": { "back": "pattern", color: "white", "icon": "page" } }, scopedSlots: _vm._u([{ key: "options", fn: function() {
      return [_c("k-button", { staticClass: "k-button k-status-icon", staticStyle: { "--icon-size": "15px", "color": "var(--color-green-500)" }, attrs: { "icon": "status-listed", "data-type": "status-listed", "data-theme": "positive-icon" }, on: { "click": function($event) {
        return _vm.handleStatusClick(_vm.item);
      } } })];
    }, proxy: true }], null, false, 1890145663) }) : _vm._e();
  };
  var _sfc_staticRenderFns$2 = [];
  _sfc_render$2._withStripped = true;
  var __component__$2 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$2,
    _sfc_render$2,
    _sfc_staticRenderFns$2,
    false,
    null,
    "fab84231"
  );
  __component__$2.options.__file = "/Users/philipp/Documents/02_Offen/Kirby Plugins/email-manager-landing/site/plugins/kirby-sidebar-navigation/src/components/SidebarPageItem.vue";
  const SidebarPageItem = __component__$2.exports;
  const _sfc_main$1 = {
    name: "SidebarGroup",
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
          if (element && element.type === "page") {
            this.removePageFromGroup(element);
          }
        }
        if (evt.added) {
          const { element, newIndex } = evt.added;
          if (element.type === "page") {
            this.movePageWithinGroup(element, newIndex);
          }
        }
        this.$emit("input", {
          ...this.value,
          pages: this.value.pages
        });
      },
      removePageFromGroup(page) {
        const pageIndex = this.value.pages.findIndex((p) => p.id === page.id);
        if (pageIndex !== -1) {
          this.value.pages.splice(pageIndex, 1);
        }
      },
      movePageWithinGroup(page, newIndex) {
        const currentIndex = this.value.pages.findIndex((p) => p.id === page.id);
        if (currentIndex !== -1) {
          this.value.pages.splice(currentIndex, 1);
        }
        this.value.pages.splice(newIndex, 0, page);
      },
      onGroupOption(evt) {
        console.log(evt);
        if (evt === "edit") {
          this.$emit("edit");
        } else if (evt === "delete") {
          this.$emit("delete");
        }
      }
    },
    mounted() {
      console.log(this.value);
    }
  };
  var _sfc_render$1 = function render() {
    var _vm = this, _c = _vm._self._c;
    return _c("div", { staticClass: "k-sidebar-group" }, [_c("header", { staticClass: "k-sidebar-group-header" }, [_c("div", { staticClass: "k-sidebar-group-header-title" }, [_c("button", { staticClass: "k-button k-sort-handle k-sort-button k-item-sort-handle", attrs: { "data-has-icon": "true", "aria-label": "Bewegen um zu sortieren …", "title": "Bewegen um zu sortieren …", "type": "button", "tabindex": "-1" } }, [_c("span", { staticClass: "k-button-icon" }, [_c("svg", { staticClass: "k-icon", attrs: { "aria-hidden": "true", "data-type": "sort" } }, [_c("use", { attrs: { "xlink:href": "#icon-sort" } })])])]), _c("h3", [_vm._v(_vm._s(_vm.value.text))])]), _c("div", { staticClass: "k-sidebar-group-header-options" }, [_c("k-options-dropdown", { attrs: { "options": [{ text: _vm.$t("edit"), icon: "edit", click: "edit" }, { text: _vm.$t("delete"), icon: "trash", click: "delete" }] }, on: { "action": function($event) {
      return _vm.onGroupOption($event);
    } } })], 1)]), _c("k-draggable", { staticClass: "k-draggable-group", class: { "k-empty": !_vm.value.pages.length }, attrs: { "list": _vm.value.pages, "animation": 150, "options": {
      group: {
        name: "pages",
        pull: true,
        put: (to, from, dragEl) => {
          return dragEl.__vue__ && dragEl.__vue__.$children[0].$options.name === "SidebarPageItem";
        }
      }
    } }, on: { "change": _vm.onDragChange } }, _vm._l(_vm.value.pages, function(page) {
      return _c("k-box", { key: page.id }, [_c("SidebarPageItem", { attrs: { "item": page } })], 1);
    }), 1), _c("footer", { staticClass: "k-sidebar-group-footer" })], 1);
  };
  var _sfc_staticRenderFns$1 = [];
  _sfc_render$1._withStripped = true;
  var __component__$1 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$1,
    _sfc_render$1,
    _sfc_staticRenderFns$1,
    false,
    null,
    "39a06387"
  );
  __component__$1.options.__file = "/Users/philipp/Documents/02_Offen/Kirby Plugins/email-manager-landing/site/plugins/kirby-sidebar-navigation/src/components/SidebarGroup.vue";
  const SidebarGroup = __component__$1.exports;
  const _sfc_main = {
    name: "SidebarNavigation",
    components: {
      SidebarPageItem,
      SidebarGroup
    },
    props: {
      value: {
        type: Array,
        default: () => []
      },
      path: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        pages: this.value || []
      };
    },
    methods: {
      addGroup() {
        this.$panel.dialog.open({
          component: "k-form-dialog",
          props: {
            fields: {
              title: {
                label: "Name der Gruppe",
                type: "text"
              }
            }
          },
          on: {
            submit: (value) => {
              this.$emit("input", [...this.value, {
                uuid: this.$helper.string.uuid(),
                type: "group",
                text: value.title,
                pages: []
              }]);
              this.$panel.dialog.close();
            }
          }
        });
      },
      onGroupOption(option, group) {
        console.log(group);
        if (option === "edit") {
          this.$panel.dialog.open({
            component: "k-form-dialog",
            props: {
              fields: {
                title: {
                  label: "Name der Gruppe",
                  type: "text"
                }
              },
              value: {
                title: group.text
              }
            },
            on: {
              submit: (value) => {
                this.$emit("input", this.value.map(
                  (item) => item.uuid === group.uuid ? { ...item, text: value.title } : item
                ));
                this.$panel.dialog.close();
              }
            }
          });
        } else if (option === "delete") {
          this.$panel.dialog.open({
            component: "k-remove-dialog",
            props: {
              text: `Willst du die Gruppe <strong>${group.text}</strong> wirklich löschen?`
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
        const response = await this.$api.get(`sidebar-navigation/pages?path=${this.path}`);
        const newValue = [...this.value];
        for (let i = newValue.length - 1; i >= 0; i--) {
          const item = newValue[i];
          console.log(item);
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
      removePage(groupIndex, pageIndex) {
        const newValue = [...this.value];
        const page = newValue[groupIndex].pages.splice(pageIndex, 1)[0];
        newValue.push(page);
        this.$emit("input", newValue);
      },
      onDragChange(evt) {
        if (evt.removed) {
          const { element } = evt.removed;
          if (element && element.type === "page") {
            this.removeElementFromCurrentLocation(element);
          }
        }
        if (evt.added) {
          const { element, newIndex } = evt.added;
          const isInRoot = this.value.some((item) => item.id === element.id);
          if (element && element.type === "page" && !isInRoot) {
            this.addElementToNewLocation(element, newIndex);
          }
        }
        this.$emit("input", this.value);
      },
      removeElementFromCurrentLocation(element) {
        const index = this.value.findIndex((item) => item.id === element.id);
        if (index !== -1) {
          this.value.splice(index, 1);
        }
      },
      addElementToNewLocation(element, newIndex) {
        this.value.splice(newIndex, 0, element);
      }
    },
    created() {
      this.loadPages();
    }
  };
  var _sfc_render = function render() {
    var _vm = this, _c = _vm._self._c;
    return _c("section", { staticClass: "k-section" }, [_c("header", { staticClass: "k-section-header" }, [_vm._m(0), _c("div", { staticClass: "k-button-group k-section-buttons" }, [_c("k-button", { attrs: { "variant": "filled", "size": "xs", "icon": "addgroup" }, on: { "click": _vm.addGroup } })], 1)]), !_vm.value.length ? _c("k-empty", { attrs: { "icon": "page", "text": _vm.$t("pages.empty") } }) : _vm._e(), _c("k-draggable", { staticClass: "k-draggable-container", attrs: { "list": _vm.value, "animation": 150, "options": {
      group: {
        name: "root",
        pull: true,
        put: ["pages"]
      }
    } }, on: { "change": _vm.onDragChange } }, _vm._l(_vm.value, function(item, index) {
      return _c("k-box", { key: item.id }, [item.type === "group" ? _c("SidebarGroup", { attrs: { "value": item }, on: { "input": function($event) {
        return _vm.updateGroup(index, $event);
      }, "edit": function($event) {
        return _vm.onGroupOption("edit", item);
      }, "delete": function($event) {
        return _vm.onGroupOption("delete", item);
      } } }) : _c("SidebarPageItem", { attrs: { "item": item } })], 1);
    }), 1)], 1);
  };
  var _sfc_staticRenderFns = [function() {
    var _vm = this, _c = _vm._self._c;
    return _c("h2", { staticClass: "k-label k-section-label" }, [_c("span", { staticClass: "k-label-text" }, [_vm._v("Navigation")])]);
  }];
  _sfc_render._withStripped = true;
  var __component__ = /* @__PURE__ */ normalizeComponent(
    _sfc_main,
    _sfc_render,
    _sfc_staticRenderFns,
    false,
    null,
    "f00dcdf4"
  );
  __component__.options.__file = "/Users/philipp/Documents/02_Offen/Kirby Plugins/email-manager-landing/site/plugins/kirby-sidebar-navigation/src/components/SidebarNavigation.vue";
  const SidebarNavigation = __component__.exports;
  panel.plugin("philippoehrlein/kirby-sidebar-navigation", {
    icons: {
      "seperator": '<path d="M2 11H4V13H2V11ZM6 11H18V13H6V11ZM20 11H22V13H20V11Z"></path>',
      "addgroup": '<path d="M12.4142 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5ZM4 5V19H20V7H11.5858L9.58579 5H4ZM11 12V9H13V12H16V14H13V17H11V14H8V12H11Z"></path>'
    },
    fields: {
      sidebarnavigation: SidebarNavigation
    }
  });
})();