<?php

use Kirby\Cms\App as Kirby;
use Kirby\Data\Yaml;

Kirby::plugin('philippoehrlein/kirby-navigation-groups', [
  'fields' => [
    'navigationGroups' => [
      'props' => [
        'label' => function () {
          return $this->label();
        },
        'value' => function ($value = null) {
          return Yaml::decode($value);
        },
        'path' => function () {
          return $this->model()->id();
        }
      ],
      'save' => function ($value = null) {
        return Yaml::encode($value);
      },
    ],
  ],
  'api' => require __DIR__ . '/config/api.php',
  'translations' => require __DIR__ . '/config/translations.php'
]);
