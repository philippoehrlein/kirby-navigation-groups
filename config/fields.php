<?php

use Kirby\Data\Yaml;

return [
  'navigationgroups' => [
    'props' => [
      'label' => function () {
        return $this->label();
      },
      'value' => function ($value = null) {
        return Yaml::decode($value);
      },
      'path' => function () {
        return $this->model()->id();
      },
      'status' => function ($status = null) {
        return $status ?? 'listed';
      },
      'image' => function ($image = null) {
        return $image ?? [];
      },
      'fields' => function ($fields = null) {
        $defaultFields = [
          'title' => [
            'label' => t('field.navigationgroups.group.name'),
            'type' => 'text',
            'required' => true
          ]
        ];

        return array_merge($defaultFields, (array)$fields);
      }
    ],
    'save' => function ($value = null) {
      if ($value) {
        $sortedPages = [];
        foreach ($value as $item) {
          if ($item['type'] === 'page') {
            $sortedPages[] = $item['id'];
          } else if ($item['type'] === 'group' && isset($item['pages'])) {
            foreach ($item['pages'] as $page) {
              $sortedPages[] = $page['id'];
            }
          }
        }

        foreach ($sortedPages as $index => $pageId) {
          if ($page = page($pageId)) {
            if ($page->isWritable()) {
              $page->changeSort($index + 1);
            }
          }
        }
      }

      return Yaml::encode($value);
    },
  ],
];