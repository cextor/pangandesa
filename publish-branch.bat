@echo off
setlocal enabledelayedexpansion

:: Failsafe: Berpindah ke folder di mana file batch ini berada
cd /d "%~dp0"

:: Failsafe: Pastikan script dijalankan di root folder proyek yang tepat
if not exist package.json (
    echo [ERROR] Script ini harus dijalankan di dalam folder proyek PanganDesa!
    echo Harap letakkan file ini di: c:\laragon\www\pangandesa
    echo.
    echo Jangan memindahkan file ini ke Desktop secara langsung. 
    echo Jika Anda ingin akses cepat dari Desktop:
    echo 1. Klik kanan file "publish-branch.bat" di folder proyek.
    echo 2. Pilih Kirim ke atau Send to lalu pilih Desktop buat pintasan atau create shortcut.
    echo 3. Jalankan pintasan tersebut dari Desktop Anda.
    echo.
    echo Lokasi aktif saat ini: %cd%
    pause
    exit /b
)

echo ===================================================
echo   PanganDesa Deployer - Branch: deploy
echo ===================================================
echo.

:: Mengambil URL remote origin secara dinamis dari git proyek utama
for /f "tokens=*" %%i in ('git config --get remote.origin.url') do (
    set REMOTELINK=%%i
)

if "!REMOTELINK!"=="" (
    echo [ERROR] Git remote 'origin' tidak ditemukan di proyek ini.
    echo Pastikan Anda menjalankan script ini di root folder git Anda.
    pause
    exit /b
)

echo [INFO] Mendeteksi Remote Git: !REMOTELINK!
echo.

echo [1/4] Menghapus folder dist lama...
if exist dist (
    rd /s /q dist
)
echo Folder dist lama berhasil dibersihkan.
echo.

echo [2/4] Melakukan build React terbaru (npm run build)...
cmd /c npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Gagal mem-build proyek React. Harap periksa error di atas.
    pause
    exit /b
)
echo.

echo [3/4] Mempersiapkan konfigurasi .htaccess untuk React Router...
if exist .htaccess (
    copy .htaccess dist\.htaccess > nul
    echo File .htaccess berhasil disalin ke folder dist.
) else (
    echo [WARNING] File .htaccess tidak ditemukan di root folder.
)
echo.

echo [4/4] Menginisialisasi Git di folder dist dan melakukan push ke branch 'deploy'...
cd dist
git init -q
git remote add origin !REMOTELINK!
git checkout -b deploy -q
git add .
git commit -m "Deploy update: %date% %time%" -q

echo.
echo Sedang melakukan push ke GitHub...
git push -f origin deploy

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Gagal melakukan push ke branch 'deploy'.
    echo Pastikan kredensial GitHub atau SSH Key Anda sudah aktif.
) else (
    echo.
    echo ===================================================
    echo   SUKSES! File dist berhasil didorong ke branch: deploy
    echo ===================================================
    echo.
    echo SEKARANG DI hPANEL HOSTINGER:
    echo 1. Hubungkan repositori Anda: !REMOTELINK!
    echo 2. Setel "Branch" yang akan di-deploy ke: deploy
    echo 3. Arahkan "Direktori Instalasi" ke: /public_html
    echo 4. Jalankan Deploy/Pull di hPanel Hostinger.
)

cd ..
pause
