<?php

use Kirby\Data\Yaml;

require_once __DIR__ . '/../lib/Group.php';
use KirbyNavigationGroups\Group;

return [
  'toGroupItems' => function ($field) {
    $value = $field->value();
    $data = Yaml::decode($value);

    $definition = $field->parent()?->blueprint()->field($field->key());
    $customFields = (array)($definition['fields'] ?? []);

    $items = array_map(function ($item) use ($customFields) {
      if ($item['type'] === 'group') {
        return new Group($item, $customFields);
      } elseif ($item['type'] === 'page') {
        return page($item['id']);
      }
    }, $data);

    return $items;
  }
];