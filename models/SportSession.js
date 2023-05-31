class SportSession {
  constructor(id, sportId, teamA, teamB, additionalPlayers, dateTime, venue, createdBy) {
    this.id = id;
    this.sportId = sportId;
    this.teamA = teamA;
    this.teamB = teamB;
    this.additionalPlayers = additionalPlayers;
    this.dateTime = dateTime;
    this.venue = venue;
    this.createdBy = createdBy;
  }
}

module.exports = SportSession;
