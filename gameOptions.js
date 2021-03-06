const tableSize = 10;
export const game = {
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

export const play = {
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

