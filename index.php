<?php

use Kirby\Cms\App as Kirby;
use Kirby\Cms\Page;
use Kirby\Data\Yaml;

Kirby::plugin('philippoehrlein/kirby-sidebar-navigation', [
  'fields' => [
    'sidebarnavigation' => [
      'props' => [
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
  'api' => [
    'routes' => [
      [
        'pattern' => 'sidebar-navigation/pages',
        'method' => 'GET',
        'action' => function () {
          $path = get('path');
          $page = kirby()->page($path);
          $children = $page->children()->listed();
          
          $result = [];
          foreach($children as $child) {
            $result[] = [
              'id' => $child->id(),
              'title' => $child->title()->value(),
              'uuid' => $child->uuid()->value(),
              'path' => $child->id(),
              'status' => $child->status(),
              'permissions' => $child->permissions()
            ];
          }
          return $result;
        }
      ]
    ]
  ]
]);
