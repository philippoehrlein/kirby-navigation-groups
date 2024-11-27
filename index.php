<?php
require_once __DIR__ . '/vendor/autoload.php';

use Kirby\Cms\App as Kirby;
use Kirby\Data\Yaml;
use KirbyNavigationGroups\Group;

Kirby::plugin('philippoehrlein/kirby-navigation-groups', [
  'fields' => [
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
        return Yaml::encode($value);
      },
    ],
  ],
  'api' => require __DIR__ . '/config/api.php',
  'translations' => require __DIR__ . '/config/translations.php',
  'fieldMethods' => [
    'toGroupItems' => function ($field) {
      $value = $field->value();
      $data = Yaml::decode($value);

      $customFields = $field->fields()->toArray();

      $items = array_map(function ($item) use ($customFields) {
        if ($item['type'] === 'group') {
          return new Group($item, $customFields);
        } elseif ($item['type'] === 'page') {
          return page($item['id']);
        }
      }, $data);

      return $items;
    }
  ],
  'version' => '1.0.2'
]);