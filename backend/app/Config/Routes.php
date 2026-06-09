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
    $routes->post('auth/register', 'AuthController::register');
    $routes->post('auth/check-email', 'AuthController::checkEmail');
    $routes->put('auth/profile/(:segment)', 'AuthController::updateProfile/$1');
    $routes->put('auth/change-password/(:segment)', 'AuthController::changePassword/$1');
    $routes->put('auth/change-pin/(:segment)', 'AuthController::changePin/$1');
    $routes->post('auth/upload-avatar/(:segment)', 'AuthController::uploadAvatar/$1');
    $routes->get('users', 'AuthController::getAllUsers');
    $routes->delete('users/(:segment)', 'AuthController::deleteUser/$1');
    
    // Notification Routes
    $routes->get('notifications', 'NotificationController::index');
    $routes->post('notifications', 'NotificationController::create');
    $routes->put('notifications/(:segment)/read', 'NotificationController::markAsRead/$1');
    $routes->put('notifications/read-all', 'NotificationController::markAllAsRead');
    
    // Resource Routes
    $routes->post('products/upload', 'ProductController::uploadImage');
    $routes->resource('products', ['controller' => 'ProductController']);
    $routes->resource('categories', ['controller' => 'CategoryController', 'only' => ['index']]);
    $routes->resource('promos', ['controller' => 'PromoController']);
    $routes->resource('addresses', ['controller' => 'AddressController']);
    $routes->put('addresses/(:segment)/default', 'AddressController::setDefault/$1');
    
    // Order Routes
    $routes->get('orders', 'OrderController::index');
    $routes->post('orders', 'OrderController::create');
    $routes->post('orders/(:segment)/status', 'OrderController::updateStatus/$1');
    
    // Chat Routes
    $routes->get('chats/order/(:segment)', 'ChatController::getByOrder/$1');
    $routes->post('chats', 'ChatController::create');
    
    // Buyer Request PO Routes
    $routes->get('buyer-requests', 'BuyerRequestController::index');
    $routes->post('buyer-requests', 'BuyerRequestController::create');
    $routes->put('buyer-requests/(:segment)/status', 'BuyerRequestController::updateStatus/$1');
});
