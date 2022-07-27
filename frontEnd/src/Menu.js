import { FightingSurfaceApi } from "./FightingSurfaceApi.js";
import { changeMessageStatus } from './generate.js';

export class Menu {

    constructor(gameDOMElement, overlayDOMElement, menuDOMElement){
        this.game = gameDOMElement;
        this.overlay = overlayDOMElement;
        this.menu = menuDOMElement;
    }

    menuBase(){
        const menuDiv = document.createElement('div');

        const playBtn = document.createElement('button');
        const scoresBtn = document.createElement('button');
        const creditBtn = document.createElement('button');

        playBtn.textContent = 'Jouer';
        scoresBtn.textContent = 'Scores';
        creditBtn.textContent = 'Crédits';

        playBtn.classList.add('nes-btn', 'is-warning');
        scoresBtn.classList.add('nes-btn', 'is-warning', 'my-[1vh]');
        creditBtn.classList.add('nes-btn', 'is-warning');

        menuDiv.classList.add('flex', 'flex-col', 'min-w-[150px]' ,'w-[15%]');

        playBtn.addEventListener('click', () => {
            this.overlayZoomIn();
            this.game.classList.toggle('disable');
            this.menu.classList.toggle('disable');
        });

        scoresBtn.addEventListener('click', () => {
            this.menuScores();
            menuDiv.remove();
        });

        creditBtn.addEventListener('click', () => {
            this.menuCredits();
            menuDiv.remove();
        });

        menuDiv.append(playBtn, scoresBtn, creditBtn);
        this.menu.append(menuDiv);
        changeMessageStatus('Bienvenue dans Fighting Surface');
    }

    async menuScores(){
        const menuDiv = document.createElement('div');

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tr1 = document.createElement('tr');
        const thPseudo = document.createElement('th');
        const thScore = document.createElement('th');
        const tbody = document.createElement('tbody');
        const menuBaseBtn = document.createElement('button');

        menuDiv.classList.add('nes-table-responsive');
        table.classList.add('nes-table', 'is-bordered', 'is-dark');

        thPseudo.textContent = 'Pseudo';
        thScore.textContent = 'Score';
        
        tr1.append(thPseudo, thScore);
        thead.append(tr1);

        for(const [key, value] of Object.entries(await FightingSurfaceApi.getScores())){
            console.log(value);
            const tr = document.createElement('tr');
            const pseudo = document.createElement('td');
            const score = document.createElement('td');

            pseudo.textContent = value.name;
            score.textContent = value.score;

            tr.append(pseudo, score);
            tbody.append(tr);
        }

        table.append(thead, tbody);

        menuBaseBtn.textContent = 'Menu principal';
        menuBaseBtn.classList.add('nes-btn', 'is-warning', 'w-[50%]','max-w-[300px]' , 'mx-auto');

        menuBaseBtn.addEventListener('click', () => {
            this.menuBase();
            menuDiv.remove();
        });

        menuDiv.classList.add('flex', 'flex-col', 'min-w-[150px]' ,'w-[50%]');
        menuDiv.append(table, menuBaseBtn);

        this.menu.append(menuDiv);
    }

    menuPostScore(playerScore){
        const menuDiv = document.createElement('div');

        const label = document.createElement('label');
        const input = document.createElement('input');
        const postBtn = document.createElement('button');
        const menuBaseBtn = document.createElement('button');

        label.setAttribute('for', 'input-score');
        label.textContent = 'Pseudo';

        input.setAttribute('id', 'input-score');
        input.setAttribute('type', 'text');
        
        input.classList.add('nes-input', 'is-dark');

        postBtn.classList.add('nes-btn', 'is-warning', 'w-[50%]','max-w-[300px]' , 'mx-auto');
        postBtn.textContent = 'Envoyer';

        postBtn.addEventListener('click', () => {
            if(input.value){
                console.log(playerScore);
                FightingSurfaceApi.postScore(input.value, playerScore);
                this.menuBase();
                menuDiv.remove();
            }
        });

        menuBaseBtn.textContent = 'Menu principal';
        menuBaseBtn.classList.add('nes-btn', 'is-warning', 'w-[50%]','max-w-[300px]' , 'mx-auto');

        menuBaseBtn.addEventListener('click', () => {
            this.menuBase();
            menuDiv.remove();
        });

        menuDiv.classList.add('nes-field', 'flex', 'flex-col', 'min-w-[150px]' ,'w-[50%]');
        menuDiv.append(label, input, postBtn, menuBaseBtn);
        this.menu.innerHTML = '';
        this.menu.append(menuDiv);
    }

    menuCredits(){
        const menuDiv = document.createElement('div');

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tr1 = document.createElement('tr');
        const thAuteur = document.createElement('th');
        const thAsset = document.createElement('th');
        const tbody = document.createElement('tbody');
        const tr2 = document.createElement('tr');
        const tr3 = document.createElement('tr');
        const tdAut1 = document.createElement('td');
        const tdAut2 = document.createElement('td');
        const tdAss1 = document.createElement('td');
        const tdAss2 = document.createElement('td');
        const menuBaseBtn = document.createElement('button');

        menuDiv.classList.add('nes-table-responsive');
        table.classList.add('nes-table', 'is-bordered', 'is-dark');

        thAuteur.textContent = 'Auteur';
        thAsset.textContent = 'Asset';

        tdAut1.textContent = 'James';
        tdAut2.textContent = 'le grincheux';

        tdAss1.textContent = 'Billy';
        tdAss2.textContent = 'le grincheux';
        
        tr1.append(thAuteur, thAsset);
        tr2.append(tdAut1, tdAut2);
        tr3.append(tdAss1, tdAss2);

        thead.append(tr1);
        tbody.append(tr2, tr3);

        table.append(thead, tbody);

        menuBaseBtn.textContent = 'Menu principal';
        menuBaseBtn.classList.add('nes-btn', 'is-warning', 'w-[50%]','max-w-[300px]' , 'mx-auto');

        menuBaseBtn.addEventListener('click', () => {
            this.menuBase();
            menuDiv.remove();
        });

        menuDiv.classList.add('flex', 'flex-col', 'min-w-[150px]' ,'w-[50%]');
        menuDiv.append(table, menuBaseBtn);

        this.menu.append(menuDiv);
    }

    overlayZoomIn(){
        this.overlay.classList.add('zoom-in');
        setTimeout(() => {
            this.overlay.classList.toggle('disable');
            this.overlay.classList.remove('zoom-in');
        }, 1000);
    }

    overlayZoomOut(){
        this.overlay.classList.toggle('disable');
        this.menu.classList.toggle('disable');
        this.overlay.classList.add('zoom-out');
        setTimeout(() => {
            this.overlay.classList.remove('zoom-out');
        }, 1000);
    }
}