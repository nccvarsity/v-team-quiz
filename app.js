// Hey there! Curious on how this app worked? Currently attending Varsity?
// Why don't you join the Varsity Coders team! Find out more at
// https://vrsty.info/v-coders

function groupBy(array, key) {
  grouped = {};
  array.forEach(function (item) {
    if (item[key] in grouped) {
      grouped[item[key]].push(item);
    } else {
      grouped[item[key]] = [item];
    }
  });

  return grouped;
}

// https://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// https://docs.google.com/spreadsheets/d/e/2PACX-1vTxLC2gDcl3J05egvdWgEt9Jgc5BC299444cf9diFbkD3i5eYcWnUjPHsfwysPIL
let questionsApi = "questions.json";
let tagsApi = "tags.json";
let teamTagsApi = "teamTags.json";
let teamsApi = "teams.json";

function getQuestions() {
  return axios.get(questionsApi);
}

function getTags() {
  return axios.get(tagsApi);
}

function getTeamTags() {
  return axios.get(teamTagsApi);
}

function getTeams() {
  return axios.get(teamsApi);
}

console.log("Hey you! Yes, you there, reading the console log!");
console.log(
  "If you're attending Varsity, the V Coders are inviting you to join us!"
);
console.log("Visit https://vrsty.info/v-coders for more information!");

axios
  .all([getQuestions(), getTags(), getTeamTags(), getTeams()])
  .then(
    axios.spread(function (questionsResp, tagsResp, teamTagsResp, teamsResp) {
      // prepare questions
      questionsResponse = groupBy(questionsResp.data.rows, "question");
      questions = Object.keys(questionsResponse).map(function (key) {
        answers = questionsResponse[key];
        imagesCount = 0;
        answers.forEach(function (answer) {
          if (answer.imageurl) {
            imagesCount++;
          }
        });

        return {
          question: key,
          answers: shuffle(
            answers.map(function (answer) {
              return {
                ans: answer.answer,
                tag: answer.tag,
                imageurl: answer.imageurl,
              };
            })
          ),
          hasImages: imagesCount > 0,
          option: 0,
          selection: null,
        };
      });

      // prepare teams
      teamsByTagsGrouped = groupBy(teamTagsResp.data.rows, "tag");
      let teamsByTags = {};
      Object.keys(teamsByTagsGrouped).forEach(function (tag) {
        teams = teamsByTagsGrouped[tag];
        teamsByTags[tag] = teams.map(function (team) {
          return team.team;
        });
      });

      let teamsData = groupBy(teamsResp.data.rows, "team");

      // prepare tags
      let tagsData = groupBy(tagsResp.data.rows, "tag");

      // the app
      new Vue({
        el: "#app",
        data: {
          questions: questions,
          name: "",
          teamOpened: null,
          dark: false,
        },
        mounted: function () {
          document.getElementById("loading-btn").classList.add("hidden");
          document.querySelectorAll("ellipse, path").forEach(function(item) {
            item.setAttribute("stroke", "#F7F7F7");
        });
        document.querySelectorAll("ellipse, path").forEach(function(item, index) {
          setTimeout(function() {
            item.setAttribute("stroke", "rgb(25,25,27)");
          }, 50 * (index + 1));
        });
          document.getElementById("start").classList.remove("hidden");
          document.getElementById("quiz").classList.remove("hidden");
          document.querySelectorAll("button").forEach(function(item) {
            item.classList.add("border-black");
          });
        },
        computed: {
          tags: function () {
            let total = {};
            this.questions.forEach(function (question) {
              if (question.option == 0 || question.option == "No Tag") {
                //nothing
              } else if (question.option in total) {
                total[question.option] = total[question.option] + 1;
              } else {
                total[question.option] = 1;
              }
            });

            return Object.keys(total)
              .map(function (key) {
                return [key, total[key]];
              })
              .sort(function (a, b) {
                return b[1] - a[1];
              })
              .map(function (a) {
                tagKey = a[0];
                tagResult = tagsData[tagKey][0];
                tagResult["score"] = total[tagKey];

                return tagResult;
              });
          },
          tagResults: function () {
            let tagResults = structuredClone(this.tags.slice(0,4));
            let randomInt = Math.floor(Math.random() * 100)
            if (tagResults.length > 3) {
              if (randomInt % 2 === 0) {
                tagResults[0]["you"] = tagResults[0]["or"]
                tagResults[2]["you"] = tagResults[2]["or"]
              } else {
                tagResults[1]["you"] = tagResults[1]["or"]
                tagResults[3]["you"] = tagResults[3]["or"]
              }
            }
            return tagResults;
          },
          teams: function () {
            // find all the possible teams
            teams = {};
            this.tags
              .filter(function (tag) {
                return tag.tag != "No Tag";
              })
              .forEach(function (tag) {
                tagKey = tag.tag;
                if (!(tagKey in teamsByTags)) {
                  // skip
                }

                teamsByTags[tagKey].forEach(function (team) {
                  if (team in teams) {
                    teams[team] = teams[team] + tag.score;
                  } else {
                    teams[team] = tag.score;
                  }
                });
              });
            teamsSorted = [];
            for (team in teams) {
              teamsSorted.push([team, teams[team]]);
            }

            return teamsSorted
              .sort(function (a, b) {
                return b[1] - a[1];
              })
              .map(function (team) {
                return team[0];
              })
              .slice(0, 2);
          },
          teamResults: function () {
            return this.teams.map(function (team) {
              return teamsData[team][0];
            });
          },
          teamOthers: function () {
            teamsChosen = this.teams;
            return teamsResp.data.rows.filter(function (team) {
              return !teamsChosen.includes(team.team);
            });
          },
        },
        methods: {
          goToNext: function (index) {
            nextIndex = index + 1;
            document
              .getElementById("question-" + nextIndex)
              .scrollIntoView({ behavior: "smooth", block: "start" });
          },
          goToPrev: function (index) {
            nextIndex = index - 1;
            document
              .getElementById("question-" + nextIndex)
              .scrollIntoView({ behavior: "smooth", block: "start" });
          },
          selectAns: function (question, tag, index) {
            question.option = tag;
            question.selection = index;
          },
          goToResults: function () {
            document
              .getElementById("results").classList.remove('hidden');
            document
              .getElementById("results")
              .scrollIntoView({ behavior: "smooth", block: "start" });
            i = 1;
            this.teams.forEach(function (team) {
              ga("send", "event", "Quiz", "Result Team", team + " - " + i);
              i++;
            });
          },
          flickAppSwitch: function() {
            if (dark) {
              dark = false;
            } else {
              dark = true;
            }
          },
          openTeam: function (index) {
            if (this.teamOpened == index) {
              this.teamOpened = null;
            } else {
              this.teamOpened = index;
            }
          },
        },
      });
    })
  )
  .catch(function (error) {
    console.log(error);
  });
