var groupBy = function(array, key) {
    grouped = {}
    array.forEach(function(item) {
        if (item[key] in grouped) {
            grouped[item[key]].push(item)
        } else {
            grouped[item[key]] = [item]
        }
    })

    return grouped
}
// https://docs.google.com/spreadsheets/d/e/2PACX-1vTxLC2gDcl3J05egvdWgEt9Jgc5BC299444cf9diFbkD3i5eYcWnUjPHsfwysPIL
var questionsApi = 'https://gsx2json.herokuapp.com/api?id=1-3K53b6AXjrbq9Jw0CfTs9ioJ4m6xr7lnFkCNEwvP3I&sheet=3&columns=false'

var tagsApi = 'https://gsx2json.herokuapp.com/api?id=1-3K53b6AXjrbq9Jw0CfTs9ioJ4m6xr7lnFkCNEwvP3I&sheet=4&columns=false'

var teamsApi = 'https://gsx2json.herokuapp.com/api?id=1-3K53b6AXjrbq9Jw0CfTs9ioJ4m6xr7lnFkCNEwvP3I&sheet=5&columns=false'

function getQuestions() {
    return axios.get(questionsApi)
}

function getTags() {
    return axios.get(tagsApi)
}

function getTeams() {
    return axios.get(teamsApi)
}

axios.all([getQuestions(), getTags(), getTeams()])
    .then(axios.spread(function(questionsResp, tagsResp, teamsResp) {
        // prepare questions
        questionsResponse = groupBy(questionsResp.data.rows, 'question')
        questions = Object.keys(questionsResponse)
            .map(function(key) {
                answers = questionsResponse[key]
                return {
                    question: key,
                    answers: answers.map(function(answer) {
                        return {
                            ans: answer.answer,
                            tag: answer.tag
                        }
                    }),
                    option: 0
                }
            })

        // prepare teams
        teamsByTagsGrouped = groupBy(teamsResp.data.rows, 'tag')
        var teamsByTags = {}
        Object.keys(teamsByTagsGrouped)
            .forEach(function(tag) {
                teams = teamsByTagsGrouped[tag]
                teamsByTags[tag] = teams.map(function(team) {
                    return team.team
                })
            })

        // prepare tags
        var tagsData = groupBy(tagsResp.data.rows, 'tag')

        // the app
        new Vue({
            el: '#quiz',
            data: {
                questions: questions,
                name: '',
            },
            mounted: function() {
                document.getElementById("loading-btn").classList.add('hidden')
                document.getElementById("start-btn").classList.remove('hidden')
                this.$el.classList.remove('hidden')
            },
            computed: {
                tags: function() {
                    let total = {}
                    this.questions.forEach(function(question) {
                        if (question.option == 0) {
                            //nothing
                        } else if (question.option in total) {
                            total[question.option] = total[question.option] + 1
                        } else {
                            total[question.option] = 1
                        }
                    })

                    return Object.keys(total).map(function(key) {
                        return [key, total[key]]
                    }).sort(function(a, b) {
                        return b[1] - a[1]
                    }).map(function(a) {
                        tagKey = a[0]

                        return tagsData[tagKey][0]
                    })
                },
                teams: function() {

                    // find all the possible teams
                    teams = {}
                    this.tags.forEach(function(tag) {
                        tagKey = tag.tag
                        if (!(tagKey in teamsByTags)) {
                            // skip
                        }

                        teamsByTags[tagKey].forEach(function(team) {
                            if (team in teams) {
                                teams[team] = teams[team] + 1
                            } else {
                                teams[team] = 1
                            }
                        })
                    })
                    teamsSorted = []
                    for (team in teams) {
                        teamsSorted.push([team, teams[team]])
                    }

                    return teamsSorted
                        .sort(function(a, b) {
                            return b[1] - a[1]
                        })
                        .map(function(team) {
                            return team[0]
                        })
                        .slice(0, 3)
                }
            },
            methods: {
                goToNext: function(index) {
                    nextIndex = index + 1
                    document.getElementById("question-" + nextIndex).scrollIntoView()
                },
                goToPrev: function(index) {
                    nextIndex = index - 1
                    document.getElementById("question-" + nextIndex).scrollIntoView()
                },
                selectAns: function(question, tag) {
                    question.option = tag
                },
                goToResults: function() {
                    document.getElementById("answers").scrollIntoView()
                }
            }
        })
    }))
    .catch(function(error) {
        console.log(error)
    })
