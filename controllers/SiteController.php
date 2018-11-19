<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Application;
use yii\web\Controller;
use yii\web\Response;
use yii\filters\VerbFilter;
use app\models\LoginForm;
use app\models\ContactForm;

class SiteController extends Controller
{
    /**
     * {@inheritdoc}
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
        ];
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionIndex()
    {
        $this->layout = 'main1';
        return $this->render('index');
    }

    /**
     * Вывод на экран содержимого файловой системы
     *
     * @return string
     */

    public function actionList()
    {
        $storageRoot = Yii::getAlias('@webroot/storage/');
        $request = Yii::$app->request;
        $path = $request->get('path', '');

//        $storageRoot = '/';

        $currentRoot = $storageRoot . $path;
//        $list = array_diff(scandir($currentRoot), array('.'));

        $list = scandir($currentRoot);

        $listOfFiles = [];
        foreach ($list as $filename) {
            $filePath = $currentRoot . '/' . $filename;
            if (((filetype($filePath) == 'dir') || (filetype($filePath) == 'file')) && !(((strpos($filename, '.'))) === 0)) {
                $listOfFiles[] = [
                    'name' => $filename,
                    'size' => !is_dir($filePath) ? Yii::$app->formatter->asShortSize(filesize($filePath)) : null,
                    'type' => filetype($filePath),
                    'date' => date('Y-m-d H:i:s O', filemtime($filePath)),
                ];
            }
        }
        array_unshift($listOfFiles, [
            'name' => '..',
            'size' => null,
            'type' => 'dir',
            'date' => date('Y-m-d H:i:s O', filemtime($filePath)),
        ]);
        return $this->asJson($listOfFiles);
    }

    /**
     * Создание файла
     */

    public function actionCreate()
    {
        $storageRoot = Yii::getAlias('@webroot/storage/');

        $request = Yii::$app->request;
        $path = $request->get('path', '');

        $currentRoot = $storageRoot . $path;

    }

    /**
     * Добавление файлов
     */

    public function actionUpload()
    {
        $storageRoot = Yii::getAlias('@webroot/storage/');

        $request = Yii::$app->request;
        $path = $request->get('path', '');

        $currentRoot = $storageRoot . $path;

        $uploadFile = $currentRoot . basename($_FILES['document']['name']);

        if (move_uploaded_file($_FILES['document']['tmp_name'], $uploadFile)) {
            echo '{"success": true, "file": "' . $uploadFile . '" }';
        } else {
            echo '{"success": false}';
        }
    }

    /**
     * Сохранение файла
     */

    public function actionLoad()
    {
        $storageRoot = Yii::getAlias('@webroot/storage/');

        $request = Yii::$app->request;
        $path = $request->get('path', '');

        $currentRoot = $storageRoot . $path;

    }

    /**
     * Удаление файла
     */

    public function actionDelete()
    {
        $storageRoot = Yii::getAlias('@webroot/storage/');

        $request = Yii::$app->request;
        $path = $request->get('path', '');

        $currentRoot = $storageRoot . $path;

        unlink($currentRoot);
    }
}
