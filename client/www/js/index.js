import main from "./htmlAndLoopHandler.js";

document.addEventListener('deviceready', () => {
    console.log('Running Cordova app');
    document.getElementById('deviceready')?.classList.add('ready');
    main();

    
});

// lancement du jeu
