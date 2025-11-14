<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-R-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SITANAS v2</title>

    <link rel="stylesheet" href="{{ asset('css/style.css') }}">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"/>

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>

    @livewireStyles
</head>
<body class="public-page-body">

    @auth
        <livewire:navigasi.top-bar />
    @endauth

    <main class="content" style="padding: 2rem;">
        {{ $slot }}
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    </main>

    @livewireScripts
</body>
</html>