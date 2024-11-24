<?php

return [
  'routes' => [
      [
        'pattern' => 'navigation-groups/pages',
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
];
