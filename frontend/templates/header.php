<?php require_once 'config.php'; if (!isset($_SESSION['user_id'])) { header('Location: login.php'); exit(); } ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - SITANAS</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"/>
</head>
<body>
    <div class="main-wrapper">
        <aside class="sidebar">
            <div class="sidebar-header">
                <i class="fas fa-landmark sidebar-logo"></i>
                <h2 class="sidebar-title">SITANAS</h2>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <?php $currentPage = basename($_SERVER['SCRIPT_NAME']); ?>
                    <li><a href="index.php" class="<?php if($currentPage == 'index.php') echo 'active';?>"><i class="fas fa-tachometer-alt fa-fw"></i> Dashboard</a></li>
                    <li><a href="laporan.php" class="<?php if($currentPage == 'laporan.php') echo 'active';?>"><i class="fas fa-file-alt fa-fw"></i> Laporan</a></li>
                    <?php if ($_SESSION['role_id'] == 1): ?>
                    <li><a href="log_aktivitas.php" class="<?php if($currentPage == 'log_aktivitas.php') echo 'active';?>"><i class="fas fa-history fa-fw"></i> Log Aktivitas</a></li>
                    <?php endif; ?>
                    <li><a href="profile.php" class="<?php if($currentPage == 'profile.php') echo 'active';?>"><i class="fas fa-user-circle fa-fw"></i> Profil Saya</a></li>
                </ul>
            </nav>
            <div class="sidebar-footer">
                <a href="logout.php" class="btn btn-danger btn-block"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </div>
        </aside>
        <div class="main-container">
            <header class="topbar">
                 <div class="profile-dropdown">
                    <div class="profile-info">
                        <span>Halo, <strong><?php echo htmlspecialchars($_SESSION['nama_lengkap']); ?></strong></span>
                        <?php 
                            $foto = $_SESSION['foto_profil'] ?? 'assets/images/default-avatar.png';
                            if (empty($_SESSION['foto_profil']) || !file_exists($foto)) { $foto = 'assets/images/default-avatar.png'; }
                        ?>
                        <img src="<?php echo $foto; ?>" alt="Avatar" class="profile-avatar">
                    </div>
                 </div>
            </header>
            <main class="content">
            <?php 
                $error = get_flash_message('error'); if ($error): ?><div class="notification error"><?php echo $error; ?></div><?php endif; 
                $success = get_flash_message('success'); if ($success): ?><div class="notification success"><?php echo $success; ?></div><?php endif; 
            ?>