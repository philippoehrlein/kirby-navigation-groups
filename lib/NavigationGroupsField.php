<?php

namespace KirbyNavigationGroups;

use Kirby\Data\Yaml;
use Kirby\Form\Field\InputField;
use Kirby\Reflection\Attributes\Prop;

class NavigationGroupsField extends InputField
{
  #[Prop]
  protected string $status = 'listed';

  #[Prop]
  protected array $image = [];

  #[Prop]
  protected array $fields = [];

  protected array $value = [];

  public function fill(mixed $value): static
  {
    return parent::fill(Yaml::decode($value));
  }

  public function props(): array
  {
    return [
      ...parent::props(),
      'path' => $this->model()->id(),
      'image' => (object)$this->image,
      'fields' => array_merge([
        'title' => [
          'label' => t('field.navigationgroups.group.name'),
          'type' => 'text',
          'required' => true
        ]
      ], $this->fields)
    ];
  }

  public function submit(mixed $value): static
  {
    parent::submit($value);

    $sortedPages = [];
    foreach ($this->value as $item) {
      if ($item['type'] === 'page') {
        $sortedPages[] = $item['id'];
      } elseif ($item['type'] === 'group') {
        foreach ($item['pages'] ?? [] as $page) {
          $sortedPages[] = $page['id'];
        }
      }
    }

    foreach ($sortedPages as $index => $pageId) {
      $position = $index + 1;
      $page = $this->kirby()->page($pageId);
      if ($page?->guards()->isExecutable('changeStatus', 'listed', $position) === true) {
        $page->changeSort($position);
      }
    }

    return $this;
  }

  public function toStoredValue(): string
  {
    return Yaml::encode($this->value);
  }
}
