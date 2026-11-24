<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= $page->title()->esc() ?></title>
</head>
<body>
  <main>
    <h1><?= $page->title()->esc() ?></h1>
    <p><a href="<?= esc(url('panel/pages/' . $page->id()), 'attr') ?>">Edit navigation in the Panel</a></p>

    <nav aria-label="Grouped navigation">
      <ul>
        <?php foreach ($page->navigation()->toGroupItems() as $item): ?>
          <?php if ($item instanceof \KirbyNavigationGroups\Group): ?>
            <li>
              <h2><?= esc($item->title()) ?></h2>
              <ul>
                <?php foreach (array_filter($item->pages()) as $child): ?>
                  <li><a href="<?= esc($child->url(), 'attr') ?>"><?= $child->title()->esc() ?></a></li>
                <?php endforeach ?>
              </ul>
            </li>
          <?php elseif ($item instanceof \Kirby\Cms\Page): ?>
            <li><a href="<?= esc($item->url(), 'attr') ?>"><?= $item->title()->esc() ?></a></li>
          <?php endif ?>
        <?php endforeach ?>
      </ul>
    </nav>
  </main>
</body>
</html>
