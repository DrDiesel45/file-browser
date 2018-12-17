<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace app\assets;

use yii\web\AssetBundle;

/**
 * Main application asset bundle.
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class AppAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/site.css',
        'lib/extjs/build/classic/theme-classic/resources/theme-classic-all.css',
    ];
    public $js = [
        'lib/extjs/build/ext-all-debug.js',
//        'js/app.js',
        'app.js',
        'js/model/FileModel.js',
        'js/store/FileStore.js',
        'js/controller/FileController.js',
        'js/controller/UploadController.js',
        'js/view/FileView.js',
        'js/view/UploadView.js',
    ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}
