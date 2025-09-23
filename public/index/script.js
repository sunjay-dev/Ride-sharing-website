document.addEventListener("DOMContentLoaded", () => {
    const splash = document.getElementById("splash-screen");
    const mainContent = document.getElementById("main-content");
    
    setTimeout(() => {
        splash.classList.add("opacity-0");
    }, 3000);
    setTimeout(() => {
        splash.classList.add("hidden");
        mainContent.classList.add("flex");
        mainContent.classList.remove("hidden");
    }, 3500);
});
