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
use yii\helpers\Html;

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
        // в переменную $path передаётся путь, пройденный по папкам двойным нажатием ЛКМ
        $path = $request->get('path', '');

        // в перменной $currentPath хранится текущий путь, который отображается на экране
        $currentPath = $storageRoot . $path;

        // в переменной $listData содержимое папки в текущем пути
        $listData = scandir($currentPath);

        // массив $listOfFiles для хранения информации о содержимом
        $listOfFiles = [];
        foreach ($listData as $filename) {
            $filePath = $currentPath . '/' . $filename;
            if (((filetype($filePath) == 'dir') || (filetype($filePath) == 'file')) && !(((strpos($filename, '.'))) === 0)) {
                // заполнение массива информацией
                $listOfFiles[] = [
                    'name' => $filename,
                    'size' => !is_dir($filePath) ? Yii::$app->formatter->asShortSize(filesize($filePath)) : null,
                    'type' => filetype($filePath),
                    'date' => date('Y-m-d H:i:s O', filemtime($filePath)),
                ];
            }
        }
        // добавление .. в массив, потому что, они были удалены (.. для перехода на уровень выше)
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

        // в перменной $dirPath содержится путь, по которому надо создать папку
        $dirPath = $storageRoot . $path;

        // создание папки
        mkdir($dirPath);
        // массив с информацией о папке
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

        // загрузка файлов
        $uploadFile = $storageRoot . basename($_FILES['fileUpload']['name']);
        if (move_uploaded_file($_FILES['fileUpload']['tmp_name'], $uploadFile)) {
        }

        // массив с информацией о загружаемом файле
        $fileInfo = [
            'name' => basename($uploadFile),
            'type' => 'file',
            'date' => date('Y-m-d H:i:s O', filemtime($uploadFile))
        ];
        return $this->asJson($fileInfo);
    }

    /**
     * Скачивание файла
     */
    public function actionLoad()
    {
        $storageRoot = Yii::getAlias('@webroot/storage/');

        $request = Yii::$app->request;
        $path = $request->get('path', '');

        $loadPath = $storageRoot . $path;

        // проверка является ли то, что надо скачать файлом и само скачивание файла
        if (file_exists($loadPath)) {

            header("Content-Disposition: attachment; filename=\"" . basename($loadPath) . "\"");
            header("Content-Type: application/force-download");
            header("Content-Description: File Transfer");
            header("Content-Length: " . filesize($loadPath));

            readfile($loadPath);
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

        $deletePath = $storageRoot . $path;

        // если удаляемый объект папка, то передача управления в функцию рекурсивного удаления
        if (is_dir($deletePath)) {
            $this->delTree($deletePath);
        // если файл - то удаление файла
        } else unlink($deletePath);
    }

    /**
     * Рекурсивное удаление папок с содержимым
     *
     * @param $deletePath
     * @return bool
     */
    public static function delTree($deletePath)
    {
        $files = array_diff(scandir($deletePath), array('.', '..'));
        foreach ($files as $file) {
            // если удаляемый объект является файлом, то он удаляется, если же папкой, то
            // функция запускается заново
            (is_dir("$deletePath/$file")) ?
                self::delTree("$deletePath/$file") :
                unlink("$deletePath/$file");
        }
        return rmdir($deletePath);
    }

}