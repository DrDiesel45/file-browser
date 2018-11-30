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
     */
    public function actionList()
    {
        // в переменной $storageRoot задана корневая директория файловой системы
        $storageRoot = Yii::getAlias('@webroot/storage/');
        $request = Yii::$app->request;
        $path = $request->get('path', '');

        $currentRoot = $storageRoot . $path;

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
     * Создание папки
     */
    public function actionCreate()
    {
        $storageRoot = Yii::getAlias('@webroot/storage/');

        $request = Yii::$app->request;
        $path = $request->get('path', '');

        $dirPath = $storageRoot . $path;

        mkdir($dirPath);
        $dirInfo = [
            'name' => basename($dirPath),
            'size' => null,
            'type' => 'dir',
            'date' => date('Y-m-d H:i:s O', filemtime($dirPath))];
        return $this->asJson($dirInfo);
    }

    /**
     * Добавление файла
     */
    public function actionAdd()
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
     * Скачивание файла
     */
    public function actionLoad()
    {
        $storageRoot = Yii::getAlias('@webroot/storage/');

        $request = Yii::$app->request;
        $path = $request->get('path', '');

        $currentRoot = $storageRoot . $path;
//        var_dump($currentRoot);
//        die();
        if (file_exists($currentRoot)) {

            header("Content-Disposition: attachment; filename=\"" . basename($currentRoot) . "\"");
            header("Content-Type: application/force-download");
            header("Content-Description: File Transfer");
            header("Content-Length: " . filesize($currentRoot));

            readfile($currentRoot);
            exit;
        } else exit('No file');
    }

    /**
     * Удаление файла или папки
     */
    public function actionDelete()
    {
        $storageRoot = Yii::getAlias('@webroot/storage/');

        $request = Yii::$app->request;
        $path = $request->get('path', '');

        $currentRoot = $storageRoot . $path;
        if (is_dir($currentRoot)) {
            $this->delTree($currentRoot);
        } else unlink($currentRoot);
    }

    /**
     * Рекурсивное удаление папок с содержимым
     *
     * @param $currentRoot
     * @return bool
     */
    public static function delTree($currentRoot)
    {
        $files = array_diff(scandir($currentRoot), array('.', '..'));
        foreach ($files as $file) {
            (is_dir("$currentRoot/$file")) ?
                self::delTree("$currentRoot/$file") :
                unlink("$currentRoot/$file");
        }
        return rmdir($currentRoot);
    }

}