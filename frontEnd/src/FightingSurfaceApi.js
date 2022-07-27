export class FightingSurfaceApi {

    static async getAllMonsters(){
        const response = await fetch('http://localhost/fighting_surface/monsters');
        const monsters = await response.json();
        return monsters;
    }

    static async getScores(){
        const response = await fetch('http://localhost/fighting_surface/scores');
        const scores = await response.json();
        return scores;
    }

    static async postScore(name, score){
        const request = await fetch('http://localhost/fighting_surface/add', {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({
                "name": name,
                "score": score
            })
        });
    }
}