<?php
use Kirby\Cms\App as Kirby;

Kirby::plugin('philippoehrlein/kirby-navigation-groups', [
  'fields' => require __DIR__ . '/config/fields.php',
  'api' => require __DIR__ . '/config/api.php',
  'translations' => require __DIR__ . '/config/translations.php',
  'fieldMethods' => require __DIR__ . '/config/fieldMethods.php',
  'version' => '1.1.2'
]);