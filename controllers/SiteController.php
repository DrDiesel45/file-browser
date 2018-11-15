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
     * @param string $path
     * @return string
     */

    public function actionList($path = '')
    {
//        $list = scandir(Yii::getAlias('@webroot/storage'));
        $request = Yii::$app->request;
        $path = $request->get('path', 'Users');

        $storageRoot = '/'.$path;
        $list = scandir($storageRoot);

        $listOfFiles = [];
        foreach ($list as $filename) {
            $filePath = $storageRoot.'/'.$filename;
            $listOfFiles[] = [
                'name' => $filename,
                'size' => !is_dir($filePath) ? Yii::$app->formatter->asShortSize(filesize($filePath)) : null,
                'date' => date('Y-m-d H:i:s O', filemtime($filePath)),
        ];
        }
        return $this->asJson($listOfFiles);
    }

    /**
     * Добавление файлов
     */

    public function actionUpload()
    {
        var_dump($_FILES);
        die;
        $uploaddir = 'storage/';
        $uploadfile = $uploaddir . basename($_FILES['document']['name']);

        if (move_uploaded_file($_FILES['document']['tmp_name'], $uploadfile)) {
            echo '{"success": true, "file": "' . $uploadfile . '" }';
        } else {
            echo '{"success": false}';
        }
    }
}
