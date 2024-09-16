class land {
    constructor(_DBQuery, _disconnect) {
        this.DBQuery = _DBQuery;
        this.disconnect = _disconnect;
    }

    close () {
        this.disconnect();
    }

    async fetchAllSpaces () {
        const results = await this.DBQuery("SELECT * FROM Bid");
        return results;
    }
}

module.exports = land;