const record = document.getElementById('record');
const shot = document.getElementById('shot');
const hit = document.getElementById('hit');
const dead = document.getElementById('dead');
const enemy = document.getElementById('enemy');
const again = document.getElementById('again');
const header = document.querySelector('.header');

const tableSize = 10;

const game = {
    ships: [],
    shipCount: 0,
    optionShip: {
        count: [1, 2, 3, 4],
        size: [4, 3, 2, 1]
    },
    collision: new Set(),
    generateShip() {
        for (let i = 0; i < this.optionShip.count.length; i++) {
            for (let j = 0; j < this.optionShip.count[i]; j++) {
                const size = this.optionShip.size[i];
                const ship = this.generateOptionsShip(size);
                this.ships.push(ship);
                this.shipCount++;
            }
        }
    },
    generateOptionsShip(shipSize) {
        const ship = {
            hit: [],
            location: [],
        };
        const direction = Math.random() < 0.5;
        let x, y;
        if (direction) {
            x = Math.floor(Math.random() * tableSize);
            y = Math.floor(Math.random() * (tableSize - shipSize));
        } else {
            x = Math.floor(Math.random() * (tableSize - shipSize));
            y = Math.floor(Math.random() * tableSize);
        }


        for (let i = 0; i < shipSize; i++) {
            if (direction){
                ship.location.push(x + '' + (y + i));
            } else {
                ship.location.push((x + i) + '' + y);
            }
            ship.hit.push('');
        }
        if (this.checkCollision(ship.location)) {
            return this.generateOptionsShip(shipSize);
        }

        this.addCollision(ship.location);
        return ship;
    },
    checkCollision(location) {
        for (const coord of location) {
            if (this.collision.has(coord)) {
                return true;
            }

        }
    },
    addCollision(location) {
        for (let i = 0; i < location.length; i++) {
            const startCoordX = location[i][0] - 1;
            for (let j = startCoordX; j < startCoordX + 3; j++){
                const startCoordY = location[i][1] - 1;
                for (let z = startCoordY; z < startCoordY + 3; z++) {
                    if (j >= 0 && j < tableSize && z >= 0 && z < tableSize) {
                        const coord = j + '' + z;
                        this.collision.add(coord);
                    }

                }
            }
        }
    }

};
const play = {
    record: localStorage.getItem('seaBattleRecord') || 0,
    shot: 0,
    hit: 0,
    dead: 0,
    set updateData(data) {
        this[data] += 1;
        this.render();
    },
    render() {
        record.textContent = this.record;
        shot.textContent = this.shot;
        hit.textContent = this.hit;
        dead.textContent = this.dead;
    }
};

const show = {
    hit(elem) {
        this.changeClass(elem, 'hit');
    },
    miss(elem) {
        this.changeClass(elem, 'miss');
    },
    dead(elem) {
        this.changeClass(elem, 'dead');
    },
    changeClass(elem, value) {
        elem.className = value;
    }
};

const fire = (event) => {
    const target = event.target;
    if (target.classList.length > 0 ||
        target.tagName !== 'TD' ||
        !game.shipCount) return;
    show.miss(target);
    play.updateData = 'shot';

    for (let i = 0; i < game.ships.length; i++) {
        const ship = game.ships[i];
        const index = ship.location.indexOf(target.id);
        if (index >= 0) {
            show.hit(target);
            play.updateData = 'hit';
            ship.hit[index] = 'x';
            const life = ship.hit.indexOf('');
            if (life < 0) {
                play.updateData = 'dead';
                for (const id of ship.location) {
                    show.dead(document.getElementById(id));
                }
                game.shipCount -= 1;

                if (!game.shipCount) {
                    header.textContent = 'Игра Окончена!';
                    header.style.color = 'red';

                    if (play.shot < play.record || play.record === 0) {
                        localStorage.setItem('seaBattleRecord', play.shot);
                        play.record = play.shot;

                        passData(play.record, localStorage.getItem('name'));
                        //downloadData(renderRatingCells);
                        let newObj = {};
                        let arr = document.querySelectorAll('td');
                        console.log(arr);
                        newObj[localStorage.getItem('name')] = play.record;
                        renderRatingCells(newObj);
                        play.render();
                    }
                }
            }
        }
    }
};

const downloadData = (render) => {
    fetch('./rating.json')
        .then(response => response.json())
        .then((data) => render(data));
};

const renderRatingCells = (data) => {
    let keys = Object.keys(data);
    let values = Object.values(data);
    let ratingTable = document.querySelector('#rating_table');
    for (let i = 0; i < keys.length; i++) {
        ratingTable.appendChild(document.createElement('tr'));
        let name = document.createElement('td');
        name.innerText = keys[i];
        ratingTable.appendChild(name);
        let score = document.createElement('td');
        score.innerText = values[i];
        ratingTable.appendChild(score);
    }
};

const passData = (score, username) => {
    let json = JSON.stringify({score: score, name: username});
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "./sendData");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(json);
};


const init = () => {
    if (!localStorage.getItem('name')){
        let username = prompt('Введите имя для таблицы рейтинга?');
        localStorage.setItem('name', username);
    }

    downloadData(renderRatingCells);
    enemy.addEventListener('click', fire);
    play.render();
    game.generateShip();
    again.addEventListener('click', () => {
        location.reload();
        /*
        let tables = document.querySelectorAll('td');
        tables.forEach(el => {
            if (el.classList.length > 0) {
                el.classList.remove('miss');
                el.classList.remove('hit');
                el.classList.remove('dead');
            }
        });
        header.textContent = 'SEA BATTLE';
        header.style.color = 'black';

        game.ships = [];
        game.shipCount = 0;
        game.collision.clear();
        game.generateShip();

        play.shot = 0;
        play.hit = 0;
        play.dead = 0;
        play.render();
        */
    });


    record.addEventListener('dblclick', () => {
        localStorage.removeItem('seaBattleRecord');
        play.record = 0;
        play.render();
    });


};

init();