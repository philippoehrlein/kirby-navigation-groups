<?php

return [
  'routes' => [
    [
      'pattern' => 'navigation-groups/pages',
      'method' => 'GET',
      'action' => function () {
        $path = get('path');
        $status = get('status', 'listed');
        $status_values = ['all', 'listed', 'unlisted', 'published'];

        $status = $status === 'all' ? 'published' : $status;
        $status = in_array($status, $status_values) ? $status : 'listed';
        
        $parent = $path === 'site' 
          ? site() 
          : kirby()->page($path);

        if (!$parent) {
          return [];
        }

        $children = $parent->children()->$status();
        
        $result = [];
        foreach ($children as $child) {
          $image = $child->image();

          $result[] = [
            'id' => $child->id(),
            'title' => $child->title()->value(),
            'uuid' => $child->uuid()->value(),
            'path' => $child->id(),
            'status' => $child->status(),
            'permissions' => $child->permissions(),
            'image' => $image ? $image->url() : null
          ];
        }
        return $result;
      }
    ]
  ]
];