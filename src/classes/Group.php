<?php

namespace KirbyNavigationGroups;

class Group
{
  protected $attributes;
  protected $customFields;

  public function __construct(array $attributes, array $customFields)
  {
    $this->attributes = $attributes;
    $this->customFields = $customFields;
  }

  public function uuid()
  {
    return $this->attributes['uuid'] ?? null;
  }

  public function title()
  {
    return $this->attributes['title'] ?? null;
  }

  public function pages()
  {
    return array_map(function ($page) {
      return page($page['id']);
    }, $this->attributes['pages'] ?? []);
  }

  public function __call($name, $arguments)
  {
    return $this->attributes[$name] ?? null;
  }
}