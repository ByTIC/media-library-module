<?php

namespace ByTIC\MediaLibraryModule\Controllers\Traits\Async;

/**
 * Class Covers
 * @package ByTIC\MediaLibraryModule\Controllers\Traits\Async
 */
trait Covers
{
    
    public function uploadCover()
    {
        $item = $this->getModelFromRequest();

        $cover = $item->uploadCover();

        if (is_object($cover)) {
            $response['type'] = 'success';
            $response['url'] = $cover->url;
            $response['path'] = $cover->name;
            $response['width'] = $cover->cropWidth;
            $response['height'] = $cover->cropHeight;
        }

        $response['message'] = $item->errors['upload'];
        $this->setResponseValues($response);
    }

    /**
     * @param $values
     * @return void
     */
    abstract public function setResponseValues($values);

    public function cropCover()
    {
        $item = $this->checkItem($_POST);

        $cover = $item->cropCovers($_POST);

        if ($cover) {
            $response['type'] = 'success';
            $response['url'] = $cover->url;
            $response['name'] = $cover->name;
        }
        $this->setResponseValues($response);
    }

    public function setDefaultCover()
    {
        $item = $this->getModelFromRequest();

        if ($item->setDefaultCover($_POST)) {
            $response['type'] = 'success';
        }
        $this->setResponseValues($response);
    }

    public function removeCover()
    {
        $item = $this->getModelFromRequest();

        if ($item->removeCover($_POST)) {
            $response['type'] = 'success';
        }
        $this->setResponseValues($response);
    }
}
