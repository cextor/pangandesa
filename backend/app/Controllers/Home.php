<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index()
    {
        return $this->response->setStatusCode(403)->setJSON([
            'status'  => 403,
            'error'   => 'Forbidden',
            'message' => 'Direct access to the API service is forbidden.'
        ]);
    }
}
