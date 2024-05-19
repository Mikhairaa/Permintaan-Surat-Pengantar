// sidebar.js

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('riwayatToggle').addEventListener('click', function() {
        var submenu = document.getElementById('riwayatSubmenu');
        submenu.classList.toggle('hidden');
    });
});
