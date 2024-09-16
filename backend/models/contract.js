class contract {
    constructor(_DBQuery, _disconnect) {
        this.DBQuery = _DBQuery;
        this.disconnect = _disconnect;
    }

    close () {
        this.disconnect();
    }

    async fetchAllSpaces () {
        const results = await this.DBQuery("SELECT * FROM Contract");
        return results;
    }
}

module.exports = contract;