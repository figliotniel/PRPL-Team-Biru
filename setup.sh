#!/bin/bash

# ========================================
# SITANAS Backend Setup Script
# ========================================

echo "🚀 Starting SITANAS Backend Setup..."

# ========================================
# 1. CREATE LARAVEL PROJECT
# ========================================
echo "📦 Creating Laravel project..."
composer create-project laravel/laravel sitanas-backend
cd sitanas-backend

# ========================================
# 2. INSTALL DEPENDENCIES
# ========================================
echo "📦 Installing required packages..."

# Laravel Sanctum for API authentication
composer require laravel/sanctum

# Laravel IDE Helper (development)
composer require --dev barryvdh/laravel-ide-helper

# Laravel Debugbar (development)
composer require --dev barryvdh/laravel-debugbar

# Laravel Excel untuk export
composer require maatwebsite/excel

# Image intervention untuk upload foto
composer require intervention/image

# ========================================
# 3. CONFIGURE .ENV
# ========================================
echo "⚙️ Configuring environment..."

cat > .env << 'EOF'
APP_NAME=SITANAS
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db_sitanas
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@sitanas.test"
MAIL_FROM_NAME="${APP_NAME}"

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1,127.0.0.1:3000,::1
SESSION_DOMAIN=localhost

# Storage
FILESYSTEM_DISK=public
EOF

# ========================================
# 4. GENERATE APP KEY
#
