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
      return Yaml::encode($value);
    },
  ],
];