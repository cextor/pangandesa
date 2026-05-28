<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api', ['namespace' => 'App\Controllers\Api'], static function ($routes) {
    // OPTIONS Preflight Catch-All
    $routes->options('(:any)', static function () {
        $response = response();
        $response->setStatusCode(200);
        $response->setHeader('Access-Control-Allow-Origin', '*');
        $response->setHeader('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
        $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
        return $response;
    });

    // Auth Routes
    $routes->post('auth/login', 'AuthController::login');
    
    // Resource Routes
    $routes->resource('products', ['controller' => 'ProductController']);
    $routes->resource('categories', ['controller' => 'CategoryController', 'only' => ['index']]);
    
    // Order Routes
    $routes->get('orders', 'OrderController::index');
    $routes->post('orders', 'OrderController::create');
    $routes->put('orders/(:segment)/status', 'OrderController::updateStatus/$1');
    
    // Chat Routes
    $routes->get('chats/order/(:segment)', 'ChatController::getByOrder/$1');
    $routes->post('chats', 'ChatController::create');
    
    // Buyer Request PO Routes
    $routes->get('buyer-requests', 'BuyerRequestController::index');
    $routes->post('buyer-requests', 'BuyerRequestController::create');
    $routes->put('buyer-requests/(:segment)/status', 'BuyerRequestController::updateStatus/$1');
});
