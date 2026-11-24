<?php

require dirname(__DIR__) . '/vendor/autoload.php';

$root = dirname(__DIR__);

$kirby = new Kirby\Cms\App([
    'roots' => [
        'index' => __DIR__,
        'base' => $root,
        'site' => $root . '/site',
        'content' => $root . '/content',
    ],
    'options' => [
        'home' => 'test',
        'debug' => true,
    ],
]);

echo $kirby->render();
