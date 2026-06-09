<?php
namespace App\Helpers;

class PathHelper
{
    /**
     * Convert an absolute URL (with domain) to a relative path.
     * e.g., "http://localhost:8081/uploads/products/image.png" -> "uploads/products/image.png"
     */
    public static function toRelative($path)
    {
        if (empty($path)) {
            return $path;
        }

        // If it contains http:// or https://, strip it to get the relative path
        if (strpos($path, 'http://') === 0 || strpos($path, 'https://') === 0) {
            $parsedUrl = parse_url($path);
            if (isset($parsedUrl['path'])) {
                return ltrim($parsedUrl['path'], '/');
            }
        }

        return ltrim($path, '/');
    }

    /**
     * Convert a relative path to an absolute URL with the current dynamic domain.
     * e.g., "uploads/products/image.png" -> "http://localhost:8081/uploads/products/image.png"
     */
    public static function toAbsolute($path)
    {
        if (empty($path)) {
            return $path;
        }

        // If it's already an absolute URL (starts with http:// or https://) or is a base64 string, return as is
        if (strpos($path, 'http://') === 0 || strpos($path, 'https://') === 0 || strpos($path, 'data:') === 0) {
            return $path;
        }

        // Determine scheme (http vs https)
        $scheme = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
        
        // Determine host/port dynamically
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost:8081';

        return $scheme . '://' . $host . '/' . ltrim($path, '/');
    }

    /**
     * If the input is a Base64 image, save it physically and return its relative path.
     * Otherwise, return the normalized path.
     */
    public static function saveBase64Image($base64Data, $subfolder = 'payments')
    {
        if (empty($base64Data)) {
            return $base64Data;
        }

        // Check if it is a Base64 data URI
        if (preg_match('/^data:image\/(\w+);base64,/', $base64Data, $type)) {
            // Get raw base64 content
            $data = substr($base64Data, strpos($base64Data, ',') + 1);
            $data = base64_decode($data);

            if ($data === false) {
                return $base64Data; // decode failed, return original
            }

            // Determine file extension
            $extension = strtolower($type[1]); // e.g. png, jpeg, jpg, webp
            if (!in_array($extension, ['jpg', 'jpeg', 'png', 'webp'])) {
                $extension = 'png';
            }

            // Create target directory
            $uploadDir = FCPATH . 'uploads/' . $subfolder . '/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            // Generate unique filename
            $filename = uniqid('img_', true) . '.' . $extension;
            $relativeUrl = 'uploads/' . $subfolder . '/' . $filename;
            $absolutePath = $uploadDir . $filename;

            // Save file
            if (file_put_contents($absolutePath, $data) !== false) {
                return $relativeUrl;
            }
        }

        return self::toRelative($base64Data);
    }
}
