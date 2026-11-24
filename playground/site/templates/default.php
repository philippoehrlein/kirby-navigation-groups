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
    <?= $page->text()->kirbytext() ?>
    <p><a href="<?= esc(url(), 'attr') ?>">Back to the playground</a></p>
  </main>
</body>
</html>
