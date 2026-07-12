> 🇹🇷 Türkçe dokümantasyon için [buraya tıklayın](#-next-js--laravel-1)
---
# 🇬🇧 Next JS + Laravel
Next JS + Laravel Starter Kit

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)

## Getting Started
First, clone the project to your local machine.
```bash
git clone https://github.com/mevlutcelik/nextjs-laravel.git
```
Next, navigate into the `nextjs` folder, create a `.env.local` file, add the necessary variables to it, and install the project dependencies.
```bash
cd nextjs && touch .env.local && echo -e "NEXT_PUBLIC_APP_NAME=Laravel\nNEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local && npm install
```
Then, go into the `laravel` folder, copy the `.env.example` file to `.env`, install the project dependencies, generate the application key, and run the database migrations.
```bash
cd .. && cd laravel && cp .env.example .env && composer install && php artisan key:generate && php artisan migrate
```
Now, let's start our Laravel (API) project.
```bash
php artisan serve
```
Finally, open a new terminal (in the `nextjs` folder) and start our Next JS project.
```bash
npm run dev
```
And you're ready! 🥳

# 🇹🇷 Next JS + Laravel
Next JS + Laravel Başlangıç Paketi

## İçindekiler
- [Özellikler](#özellikler)
- [Başlarken](#başlarken)

## Başlarken
İlk olarak projeyi bilgisayarınıza klonlayın.
```bash
git clone https://github.com/mevlutcelik/nextjs-laravel.git
```
Ardından `nextjs` klasörüne girelim, bir `.env.local` dosyası oluşturalım, içine gerekli değişkenleri yazalım ve projenin bağımlılıklarını kuralım.
```bash
cd nextjs && touch .env.local && echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local && npm install
```
Daha sonra `laravel` klasörüne geçelim, `.env.example` dosyasını `.env` olarak kopyalayalım, proje gereksinimlerini kuralım, uygulama anahtarını (app key) oluşturalım ve veritabanını ayağa kaldıralım (migrate edelim).
```bash
cd .. && cd laravel && cp .env.example .env && composer install && php artisan key:generate && php artisan migrate
```
Şimdi Laravel (API) projemizi başlatalım.
```bash
php artisan serve
```
Son olarak, yeni bir terminal açalım (`nextjs` klasörü dizininde) ve Next JS projemizi başlatalım.
```bash
npm run dev
```
Ve hazırsınız! 🥳