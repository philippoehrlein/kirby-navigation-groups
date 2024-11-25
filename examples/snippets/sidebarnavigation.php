<?php
$items = $page->sidebarnavigation()->toGroupItems();
?>

<nav class="navigation">
  <ul>
  <?php foreach ($items as $item): ?>
  <?php if ($item->type() == 'group'): ?>
    <li>
      <h2><?= $item->title() ?></h2>
      <ul>
        <?php foreach ($item->pages() as $subPage): ?>
          <li><a href="<?= $subPage->url() ?>"><?= $subPage->title() ?></a></li>
        <?php endforeach; ?>
      </ul>
    </li>
  <?php else: ?>
    <li><a href="<?= $item->url() ?>"><?= $item->title() ?></a></li>
  <?php endif; ?>
  <?php endforeach; ?>
  </ul>
</nav>