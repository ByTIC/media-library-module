<?php

namespace ByTIC\Modules\MediaLibrary;

use ByTIC\MediaLibrary\HasMedia\HasMediaTrait;
use ByTIC\Modules\MediaLibrary\Application\Library\View\View;

/**
 * Class MediaModule
 * @package ByTIC\Modules\MediaLibrary
 */
class MediaModule
{

    /**
     * @param $path
     * @return null|string
     */
    public static function loadAssetContent($path)
    {
        $fullPath = self::basePath()
            . DIRECTORY_SEPARATOR . 'resources'
            . DIRECTORY_SEPARATOR . 'assets'
            . $path;
        if (file_exists($fullPath)) {
            return file_get_contents($fullPath);
        }
        return;
    }

    /**
     * @return string
     */
    public static function basePath()
    {
        return dirname(__DIR__);
    }

    /**
     * @param HasMediaTrait $item
     * @return null|string
     */
    public function getAdminImagesGridForModel($item)
    {
        $images = $item->getImages();

        return self::loadView(
            '/admin/gallery/images-grid.php',
            ['item' => $item, 'images' => $images]
        );
    }

    /**
     * @param $path
     * @param array $variables
     * @return null|string
     */
    public static function loadView($path, $variables = [])
    {
        return View::instance()->load($path, $variables, true);
    }
}
