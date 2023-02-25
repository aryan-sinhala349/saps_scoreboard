(($) => {
  //The current and last frames of data from TSH
  let data = {};
  let oldData = {};

  //A handle to the timeouts for the info section for each player
  let player1Timeout = null;
  let player1InstructionIndex = 0;
  let player2Timeout = null;
  let player2InstructionIndex = 0;

  //Some constants to help with animation
  const fadeOutKeyframes =
  {
    opacity: [1, 0]
  };

  const fadeInKeyframes =
  {
    opacity: [0, 1]
  };

  async function Start() {
    //Get a reference to every element this function will reference
    const body = document.body;

    const sapsLogo = document.querySelector(".saps-logo");
    const player1Container = document.querySelector(".p1.container");
    const player2Container = document.querySelector(".p2.container");
    const player1InfoContainer = document.querySelector(".p1.info-container");
    const player2InfoContainer = document.querySelector(".p2.info-container");

    //Hide all the element containers
    sapsLogo.style.opacity = 0.0;
    player1Container.style.opacity = 0.0;
    player2Container.style.opacity = 0.0;
    player1InfoContainer.style.opacity = 0.0;
    player2InfoContainer.style.opacity = 0.0;

    //Get initial data
    data = await getData();

    //The two teams' data
    const team1 = data.score.team["1"];
    const team2 = data.score.team["2"];

    //Determine if there is only one player on each team
    const team1Singles = Object.keys(team1.player).length == 1;
    const team2Singles = Object.keys(team2.player).length == 1;

    //Fade the S@PS logo in
    const ShowSapsLogo = () => {
      sapsLogo.animate(fadeInKeyframes, { duration: 1000 }).onfinish = () => {
        sapsLogo.style.opacity = 1.0;
      };
    };

    //Fill the player containers and fade them in
    const ShowPlayerContainers = () => {
      //The keyframes (opacity, transformations, and clipping paths) for the left and right containers
      const keyframesContainer1 =
      {
        opacity: [0.0, 1.0],
        transform: ["translateX(100%)", "translateX(0%)"],
        clipPath: ["polygon(0 0, 0 0, 0 100%, 0 100%)", "polygon(0 0, 100% 0, 100% 100%, 0 100%)"]
      };

      const keyframesContainer2 =
      {
        opacity: [0.0, 1.0],
        transform: ["translateX(-100%)", "translateX(0%)"],
        clipPath: ["polygon(100% 0, 100% 0%, 100% 100%, 100% 100%)", "polygon(0 0, 100% 0, 100% 100%, 0 100%)"]
      };

      //All of the elements this function will modify
      const tournamentName = player1Container.querySelector(".tournament");
      const match = player2Container.querySelector(".match");

      const player1Name = player1Container.querySelector(".name");
      const player2Name = player2Container.querySelector(".name");

      const player1Score = player1Container.querySelector(".score");
      const player2Score = player2Container.querySelector(".score");

      const player1Losing = player1Container.querySelector(".losers");
      const player2Losing = player2Container.querySelector(".losers");

      //Set the tournament and match information
      tournamentName.innerHTML = data.tournamentInfo.tournamentName;
      match.innerHTML = data.score.match;

      //If there is only one player on team 1, show their sponsor next to their tag, else show the first two players
      if (team1Singles) {
        const player = team1.player["1"];
        player1Name.innerHTML = `
          <span class="sponsor">${player.team ? player.team : ""}</span>
          ${player.name ? player.name : ""}
        `;
      }
      else
        player1Name.innerHTML = `<span class="sponsor"></span>${team1.player["1"].name} / ${team1.player["2"].name}`;

      //If there is only one player on team 2, show their sponsor next to their tag, else show the first two players
      if (team2Singles) {
        const player = team2.player["1"];
        player2Name.innerHTML = `
          <span class="sponsor">${player.team ? player.team : ""}</span>
          ${player.name ? player.name : ""}
        `;
      }
      else
        player2Name.innerHTML = `<span class="sponsor"></span>${team2.player["1"].name} / ${team2.player["2"].name}`;

      //Show both teams' scores
      player1Score.innerHTML = String(team1.score);
      player2Score.innerHTML = String(team2.score);

      //Set the losing state for both teams
      player1Losing.innerHTML = `${team1.losers ? "L" : ""}`;
      player2Losing.innerHTML = `${team2.losers ? "L" : ""}`;

      //Animate the player containers in
      player1Container.animate(keyframesContainer1, { duration: 1000 }).onfinish = () => {
        player1Container.style.opacity = 1.0;
      };

      player2Container.animate(keyframesContainer2, { duration: 1000 }).onfinish = () => {
        player2Container.style.opacity = 1.0;
      };
    };

    //Fill the player info boxes and animate them in
    const ShowPlayerInfoBoxes = () =>
    {
      const player1Info = player1InfoContainer.querySelector(".info");
      const player2Info = player2InfoContainer.querySelector(".info");

      //Team 1
      //If there is only one player on this team
      if (team1Singles)
      {
        //Get info about the player
        const playerTwitter = team1.player["1"].twitter;
        const playerPronoun = team1.player["1"].pronoun;

        //Get the plaeyr info into the correct format for HTML
        const playerTwitterFormatted = `<span class="twitter-logo"></span>@${playerTwitter}`;
        const playerPronounFormatted = playerPronoun;

        //If the player just has their twitter set, set the box to have their twitter
        if (playerTwitter != "" && playerPronoun === "")
        {
          //Fade the box in
          player1Info.style.opacity = 0.0;
          player1InfoContainer.animate(fadeInKeyframes, { duration: 200 }).onfinish = () =>
          {
            player1InfoContainer.style.opacity = 1.0;
          };

          //Fade the player's twitter in
          setTimeout(() => 
          {
            player1Info.innerHTML = playerTwitterFormatted;
            player1Info.animate(fadeInKeyframes, { duration: 200 }).onfinish = () =>
            {
              player1Info.style.opacity = 1.0;
            };
          }, 500);
        }
        //If the player just has their pronouns set, set the box to have their pronouns
        else if (playerTwitter === "" && playerPronoun != "")
        {
          //Fade the box in
          player1Info.style.opacity = 0.0;
          player1InfoContainer.animate(fadeInKeyframes, { duration: 200 }).onfinish = () =>
          {
            player1InfoContainer.style.opacity = 1.0;
          };

          //Fade the player's pronouns in
          setTimeout(() =>
          {
            player1Info.innerHTML = playerPronounFormatted;
            player1Info.animate(fadeInKeyframes, { duration: 200 }).onfinish = () =>
            {
              player1Info.style.opacity = 1.0;
            };
          }, 500);
        }
        //If the player has both their twitter and their pronouns set, cycle between them
        else if (playerTwitter != "" && playerPronoun != "")
        {
          const instructions =
          [
            {
              delay: 200,
              //Set the player's twitter
              func: () => {
                player1Info.style.opacity = 0.0;
                player1Info.innerHTML = playerTwitterFormatted;
              }
            },
            {
              delay: 0,
              //Fade the text in
              func: () => {
                player1Info.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => {
                  player1Info.style.opacity = 1.0;
                };
              }
            },
            {
              delay: 5200,
              //Fade the text out
              func: () => {
                player1Info.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
                  player1Info.style.opacity = 0.0;
                };
              }
            },
            {
              delay: 200,
              //Set the player's pronouns
              func: () => {
                player1Info.innerHTML = playerPronounFormatted;
              }
            },
            {
              delay: 0,
              //Fade the text in
              func: () => {
                player1Info.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => {
                  player1Info.style.opacity = 1.0;
                };
              }
            },
            {
              delay: 5200,
              //Fade the text out
              func: () => {
                player1Info.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
                  player1Info.style.opacity = 0.0;
                };
              }
            }
          ];

          //Execute the next instruction in the instruction list, accounting for delays
          const ExecuteNextInstruction = () => {
            if (player1InstructionIndex >= instructions.length)
              player1InstructionIndex = 0;

            //Get info about the current instruction
            const currentInstruction = instructions[player1InstructionIndex];
            const currentDelay = currentInstruction.delay;

            //Execute the current isntruction after a delay, then go on to the next instruction
            player1Timeout = setTimeout(() =>
            {
              currentInstruction.func();

              player1InstructionIndex++;

              ExecuteNextInstruction();
            }, currentDelay);
          };

          //Display the info box without any text
          player1Info.style.opacity = 0.0;
          player1InfoContainer.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => 
          {
            player1InfoContainer.style.opacity = 1.0;
          };
          
          //Run the instruction list until cleared
          setTimeout(ExecuteNextInstruction, 300);
        }
      }

      //Team 2
      //If there is only one player on this team
      if (team2Singles)
      {
        //Get info about the player
        const playerTwitter = team2.player["1"].twitter;
        const playerPronoun = team2.player["1"].pronoun;

        //Get the plaeyr info into the correct format for HTML
        const playerTwitterFormatted = `<span class="twitter-logo"></span>@${playerTwitter}`;
        const playerPronounFormatted = playerPronoun;

        //If the player just has their twitter set, set the box to have their twitter
        if (playerTwitter != "" && playerPronoun === "")
        {
          //Fade the box in
          player2Info.style.opacity = 0.0;
          player2InfoContainer.animate(fadeInKeyframes, { duration: 200 }).onfinish = () =>
          {
            player2InfoContainer.style.opacity = 1.0;
          };

          //Fade the player's twitter in
          setTimeout(() => 
          {
            player2Info.innerHTML = playerTwitterFormatted;
            player2Info.animate(fadeInKeyframes, { duration: 200 }).onfinish = () =>
            {
              player2Info.style.opacity = 1.0;
            };
          }, 500);
        }
        //If the player just has their pronouns set, set the box to have their pronouns
        else if (playerTwitter === "" && playerPronoun != "")
        {
          //Fade the box in
          player2Info.style.opacity = 0.0;
          player2InfoContainer.animate(fadeInKeyframes, { duration: 200 }).onfinish = () =>
          {
            player2InfoContainer.style.opacity = 1.0;
          };player1

          //Fade the player's pronouns in
          setTimeout(() =>
          {
            player2Info.innerHTML = playerPronounFormatted;
            player2Info.animate(fadeInKeyframes, { duration: 200 }).onfinish = () =>
            {
              player2Info.style.opacity = 1.0;
            };
          }, 500);
        }
        //If the player has both their twitter and their pronouns set, cycle between them
        else if (playerTwitter != "" && playerPronoun != "")
        {
          const instructions =
          [
            {
              delay: 200,
              //Set the player's twitter
              func: () => {
                player2Info.style.opacity = 0.0;
                player2Info.innerHTML = playerTwitterFormatted;
              }
            },
            {
              delay: 0,
              //Fade the text in
              func: () => {
                player2Info.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => {
                  player2Info.style.opacity = 1.0;
                };
              }
            },
            {
              delay: 5200,
              //Fade the text out
              func: () => {
                player2Info.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
                  player2Info.style.opacity = 0.0;
                };
              }
            },
            {
              delay: 200,
              //Set the player's pronouns
              func: () => {
                player2Info.innerHTML = playerPronounFormatted;
              }
            },
            {
              delay: 0,
              //Fade the text in
              func: () => {
                player2Info.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => {
                  player2Info.style.opacity = 1.0;
                };
              }
            },
            {
              delay: 5200,
              //Fade the text out
              func: () => {
                player2Info.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
                  player2Info.style.opacity = 0.0;
                };
              }
            }
          ];

          //Execute the next instruction in the instruction list, accounting for delays
          const ExecuteNextInstruction = () => {
            if (player2InstructionIndex >= instructions.length)
              player2InstructionIndex = 0;

            //Get info about the current instruction
            const currentInstruction = instructions[player2InstructionIndex];
            const currentDelay = currentInstruction.delay;

            //Execute the current isntruction after a delay, then go on to the next instruction
            player2Timeout = setTimeout(() =>
            {
              currentInstruction.func();

              player2InstructionIndex++;

              ExecuteNextInstruction();
            }, currentDelay);
          };

          //Display the info box without any text
          player2Info.style.opacity = 0.0;
          player2InfoContainer.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => 
          {
            player2InfoContainer.style.opacity = 1.0;
          };
          
          //Run the instruction list until cleared
          setTimeout(ExecuteNextInstruction, 300);
        }
      }
    };

    //Put all of those components together and animate them
    const AnimateIntro = () => {
      ShowSapsLogo();
      setTimeout(ShowPlayerContainers, 1200);
      setTimeout(ShowPlayerInfoBoxes, 2200);
    };

    //Show the body
    body.style.visibility = "visible";

    //Animate them
    setTimeout(AnimateIntro, 2000);
  }

  //Runs four times a second
  async function Update() {
    //Store last update's data and get this update's data
    oldData = data;
    data = await getData();

    //Check if the data is the same before even considering changing any data
    let dataSame = JSON.stringify(data) === JSON.stringify(oldData)

    if (!dataSame)
      OnDataChanged();
  }

  function OnDataChanged() {
    //Change tournament name
    if (data.tournamentInfo.tournamentName != oldData.tournamentInfo.tournamentName)
      OnTournamentNameChanged();

    //Change match name
    if (data.score.match != oldData.score.match)
      OnMatchChanged();

    //Change team 1
    if (JSON.stringify(data.score.team["1"]) != JSON.stringify(oldData.score.team["1"]))
      OnTeam1Change();

    //Change team 2
    if (JSON.stringify(data.score.team["2"]) != JSON.stringify(oldData.score.team["2"]))
      OnTeam2Change();
  }

  //Called when the tournament name is changed
  function OnTournamentNameChanged() {
    //Get all the elements this function will modify
    const tournamentName = document.querySelector(".tournament");

    //Animate the tournament name changing
    tournamentName.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
      tournamentName.innerHTML = data.tournamentInfo.tournamentName;
      tournamentName.animate(fadeInKeyframes, { duration: 200 });
    };
  }

  //Called when the match name is changed
  function OnMatchChanged() {
    //Get all the elements this function will modify
    const matchName = document.querySelector(".match");

    //Animate the match name changing
    matchName.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
      matchName.innerHTML = data.score.match;
      matchName.animate(fadeInKeyframes, { duration: 200 });
    };
  }

  //Called when any of the data in team 1 has changed
  function OnTeam1Change() {
    //Get the current and old data
    const team = data.score.team["1"];
    const oldTeam = oldData.score.team["1"];

    //Get the player container
    const playerContainer = document.querySelector(".p1.container");

    //Called when the score is changed
    const OnTeamScoreChange = () => {
      //Get all the elements this function will modify
      const playerScore = playerContainer.querySelector(".score");

      //Animate the score changing
      playerScore.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
        playerScore.innerHTML = String(team.score);
        playerScore.animate(fadeInKeyframes, { duration: 200 });
      };
    };

    //Called when the relevant player info is changed
    const OnTeamPlayersChanged = () => {
      //Get all the elements this function will modify
      const playerName = playerContainer.querySelector(".name");
      const playerInfoContainer = document.querySelector(".p1.info-container");
      const playerInfo = playerInfoContainer.querySelector(".info");

      //Determine if there is only one player on this team
      const teamSingles = Object.keys(team.player) == 1;

      //If there is only one player on this team, display their name and their tag, else display both players' tags
      let innerHTML = "";

      if (teamSingles) {
        const player = team.player["1"];
        innerHTML = `
          <span class="sponsor">${player.team ? player.team : ""}</span>
          ${player.name ? player.name : ""}
        `;
      }
      else
        innerHTML = `<span class="sponsor"></span>${team.player["1"].name} / ${team.player["2"].name}`;

      //Animate the player name changing
      playerName.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
        playerName.innerHTML = innerHTML;
        playerName.animate(fadeInKeyframes, { duration: 200 });
      };

      //If there is more than one player, disable the info box
      if (!teamSingles) {
        if (playerInfoContainer.style.opacity == 1.0)
          playerInfoContainer.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () =>
          {
            playerInfoContainer.style.opacity = 0.0;
          };

        return;
      }

      //Get info about the player
      const playerTwitter = team.player["1"].twitter;
      const playerPronoun = team.player["1"].pronoun;

      //In case the previous player had both their twitter and their pronouns set, clear the timeout
      clearTimeout(player1Timeout);

      //If neither the twitter nor the pronouns are set, disable the info box
      if (playerTwitter === "" && playerPronoun === "") {
        if (playerInfoContainer.style.opacity == 1.0)
          playerInfoContainer.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () =>
          {
            playerInfoContainer.style.opacity = 0.0;
          };

        return;
      }

      //Get the player info into the correct format for HTML
      const playerTwitterFormatted = `<span class="twitter-logo"></span>@${playerTwitter}`;
      const playerPronounFormatted = playerPronoun;

      //If the player just has their twitter set, set the box to have their twitter
      if (playerTwitter != "" && playerPronoun === "") {
        //If the player info box isn't visible, display it without any text, else fade out the previous player's info
        if (playerInfoContainer.style.opacity == 0.0) {
          playerInfo.style.opacity = 0.0;
          playerInfoContainer.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => {
            playerInfoContainer.style.opacity = 1.0;
          };
        }
        else {
          playerInfo.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
            playerInfo.style.opacity = 0.0;
          };
        }

        //Fade the player's twitter in
        setTimeout(() => {
          playerInfo.innerHTML = playerTwitterFormatted;
          playerInfo.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => {
            playerInfo.style.opacity = 1.0;
          };
        }, 500);

        return;
      }

      //If the player just has their pronouns set, set the box to have their pronouns
      if (playerTwitter === "" && playerPronoun != "") {
        //If the player info box isn't visible, display it without any text, else fade out the previous player's info
        if (playerInfoContainer.style.opacity == 0.0) {
          playerInfo.style.opacity = 0.0;
          playerInfoContainer.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => {
            playerInfoContainer.style.opacity = 1.0;
          };
        }
        else {
          playerInfo.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
            playerInfo.style.opacity = 0.0;
          };
        }

        //Fade the player's pronouns in
        setTimeout(() => {
          playerInfo.innerHTML = playerPronounFormatted;
          playerInfo.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => {
            playerInfo.style.opacity = 1.0;
          };
        }, 500);

        return;
      }

      //In this case, both must be set
      //A list of all the instructions and their delays
      const instructions =
        [
          {
            delay: 200,
            //Set the player's twitter
            func: () => {
              playerInfo.style.opacity = 0.0;
              playerInfo.innerHTML = playerTwitterFormatted;
            }
          },
          {
            delay: 0,
            //Fade the text in
            func: () => {
              playerInfo.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => {
                playerInfo.style.opacity = 1.0;
              };
            }
          },
          {
            delay: 5200,
            //Fade the text out
            func: () => {
              playerInfo.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
                playerInfo.style.opacity = 0.0;
              };
            }
          },
          {
            delay: 200,
            //Set the player's pronouns
            func: () => {
              playerInfo.innerHTML = playerPronounFormatted;
            }
          },
          {
            delay: 0,
            //Fade the text in
            func: () => {
              playerInfo.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => {
                playerInfo.style.opacity = 1.0;
              };
            }
          },
          {
            delay: 5200,
            //Fade the text out
            func: () => {
              playerInfo.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
                playerInfo.style.opacity = 0.0;
              };
            }
          }
        ];

      //Execute the next instruction in the instruction list, accounting for delays
      const ExecuteNextInstruction = () => {
        if (player1InstructionIndex >= instructions.length)
          player1InstructionIndex = 0;

        //Get info about the current instruction
        const currentInstruction = instructions[player1InstructionIndex];
        const currentDelay = currentInstruction.delay;

        //Execute the current instruction after a delay, then go on to the next instruction
        player1Timeout = setTimeout(() => {
          currentInstruction.func();

          player1InstructionIndex++;

          ExecuteNextInstruction();
        }, currentDelay);
      };

      //If the player info box isn't visible, display it without any text, else fade out the previous player's info
      if (playerInfoContainer.style.opacity == 0.0) {
        playerInfo.style.opacity = 0.0;
        playerInfoContainer.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => {
          playerInfoContainer.style.opacity = 1.0;
        };
      }
      else {
        playerInfo.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
          playerInfo.style.opacity = 0.0;
        };
      }

      //Run the instruction list until cleared
      setTimeout(ExecuteNextInstruction, 300);
    };

    //Called whenever the losing status of this team is changed
    const OnTeamLosingStatusChanged = () => {
      //Get all elements this function will modify
      const playerLosing = playerContainer.querySelector(".losers");

      //Fade the player losing text out, set it, then fade it back in
      playerLosing.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () =>
      {
        playerLosing.innerHTML = `${team.losers ? "L" : ""}`;
        playerLosing.animate(fadeInKeyframes, { duration: 200 });
      };
    };

    //If the score is different, call the correct function
    if (team.score != oldTeam.score)
      OnTeamScoreChange();
      
    //If the number of players of the first player's name/sponsor has changed, call the correct function
    if (Object.keys(team.player).length != Object.keys(oldTeam.player).length ||
      team.player["1"].team != oldTeam.player["1"].team ||
      team.player["1"].name != oldTeam.player["1"].name)
      OnTeamPlayersChanged();

    //If the team's losing status has changed, call the correct function
    if (team.losers != oldTeam.losers)
      OnTeamLosingStatusChanged();
  }

  function OnTeam2Change() {
    //Get the current and old data
    const team = data.score.team["2"];
    const oldTeam = oldData.score.team["2"];

    //Get the player container
    const playerContainer = document.querySelector(".p2.container");

    //Called when the score is changed
    const OnTeamScoreChange = () => {
      //Get all the elements this function will modify
      const playerScore = playerContainer.querySelector(".score");

      //Animate the score changing
      playerScore.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
        playerScore.innerHTML = String(team.score);
        playerScore.animate(fadeInKeyframes, { duration: 200 });
      };
    };

    //Called when the relevant player info is changed
    const OnTeamPlayersChanged = () => {
      //Get all the elements this function will modify
      const playerName = playerContainer.querySelector(".name");
      const playerInfoContainer = document.querySelector(".p2.info-container");
      const playerInfo = playerInfoContainer.querySelector(".info");

      //Determine if there is only one player on this team
      const teamSingles = Object.keys(team.player) == 1;

      //If there is only one player on this team, display their name and their tag, else display both players' tags
      let innerHTML = "";

      if (teamSingles) {
        const player = team.player["1"];
        innerHTML = `
          <span class="sponsor">${player.team ? player.team : ""}</span>
          ${player.name ? player.name : ""}
        `;
      }
      else
        innerHTML = `<span class="sponsor"></span>${team.player["1"].name} / ${team.player["2"].name}`;

      //Animate the player name changing
      playerName.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
        playerName.innerHTML = innerHTML;
        playerName.animate(fadeInKeyframes, { duration: 200 });
      };

      //If there is more than one player, disable the info box
      if (!teamSingles) {
        if (playerInfoContainer.style.opacity == 1.0)
          playerInfoContainer.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () =>
          {
            playerInfoContainer.style.opacity = 0.0;
          };

        return;
      }

      //Get info about the player
      const playerTwitter = team.player["1"].twitter;
      const playerPronoun = team.player["1"].pronoun;

      //In case the previous player had both their twitter and their pronouns set, clear the timeout
      clearTimeout(player2Timeout);

      //If neither the twitter nor the pronouns are set, disable the info box
      if (playerTwitter === "" && playerPronoun === "") {
        if (playerInfoContainer.style.opacity == 1.0)
          playerInfoContainer.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () =>
          {
            playerInfoContainer.style.opacity = 0.0;
          };

        return;
      }

      //Get the player info into the correct format for HTML
      const playerTwitterFormatted = `<span class="twitter-logo"></span>@${playerTwitter}`;
      const playerPronounFormatted = playerPronoun;

      //If the player just has their twitter set, set the box to have their twitter
      if (playerTwitter != "" && playerPronoun === "") {
        //If the player info box isn't visible, display it without any text, else fade out the previous player's info
        if (playerInfoContainer.style.opacity == 0.0) {
          playerInfo.style.opacity = 0.0;
          playerInfoContainer.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => {
            playerInfoContainer.style.opacity = 1.0;
          };
        }
        else {
          playerInfo.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
            playerInfo.style.opacity = 0.0;
          };
        }

        //Fade the player's twitter in
        setTimeout(() => {
          playerInfo.innerHTML = playerTwitterFormatted;
          playerInfo.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => {
            playerInfo.style.opacity = 1.0;
          };
        }, 500);

        return;
      }

      //If the player just has their pronouns set, set the box to have their pronouns
      if (playerTwitter === "" && playerPronoun != "") {
        //If the player info box isn't visible, display it without any text, else fade out the previous player's info
        if (playerInfoContainer.style.opacity == 0.0) {
          playerInfo.style.opacity = 0.0;
          playerInfoContainer.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => {
            playerInfoContainer.style.opacity = 1.0;
          };
        }
        else {
          playerInfo.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
            playerInfo.style.opacity = 0.0;
          };
        }

        //Fade the player's pronouns in
        setTimeout(() => {
          playerInfo.innerHTML = playerPronounFormatted;
          playerInfo.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => {
            playerInfo.style.opacity = 1.0;
          };
        }, 500);

        return;
      }

      //In this case, both must be set
      //A list of all the instructions and their delays
      const instructions =
        [
          {
            delay: 200,
            //Set the player's twitter
            func: () => {
              playerInfo.style.opacity = 0.0;
              playerInfo.innerHTML = playerTwitterFormatted;
            }
          },
          {
            delay: 0,
            //Fade the text in
            func: () => {
              playerInfo.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => {
                playerInfo.style.opacity = 1.0;
              };
            }
          },
          {
            delay: 5200,
            //Fade the text out
            func: () => {
              playerInfo.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
                playerInfo.style.opacity = 0.0;
              };
            }
          },
          {
            delay: 200,
            //Set the player's pronouns
            func: () => {
              playerInfo.innerHTML = playerPronounFormatted;
            }
          },
          {
            delay: 0,
            //Fade the text in
            func: () => {
              playerInfo.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => {
                playerInfo.style.opacity = 1.0;
              };
            }
          },
          {
            delay: 5200,
            //Fade the text out
            func: () => {
              playerInfo.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
                playerInfo.style.opacity = 0.0;
              };
            }
          }
        ];

      //Execute the next instruction in the instruction list, accounting for delays
      const ExecuteNextInstruction = () => {
        if (player2InstructionIndex >= instructions.length)
        player2InstructionIndex = 0;

        //Get info about the current instruction
        const currentInstruction = instructions[player2InstructionIndex];
        const currentDelay = currentInstruction.delay;

        //Execute the current instruction after a delay, then go on to the next instruction
        player1Timeout = setTimeout(() => {
          currentInstruction.func();

          player2InstructionIndex++;

          ExecuteNextInstruction();
        }, currentDelay);
      };

      //If the player info box isn't visible, display it without any text, else fade out the previous player's info
      if (playerInfoContainer.style.opacity == 0.0) {
        playerInfo.style.opacity = 0.0;
        playerInfoContainer.animate(fadeInKeyframes, { duration: 200 }).onfinish = () => {
          playerInfoContainer.style.opacity = 1.0;
        };
      }
      else {
        playerInfo.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () => {
          playerInfo.style.opacity = 0.0;
        };
      }

      //Run the instruction list until cleared
      setTimeout(ExecuteNextInstruction, 300);
    };

    //Called whenever the losing status of this team is changed
    const OnTeamLosingStatusChanged = () => {
      //Get all elements this function will modify
      const playerLosing = playerContainer.querySelector(".losers");

      //Fade the player losing text out, set it, then fade it back in
      playerLosing.animate(fadeOutKeyframes, { duration: 200 }).onfinish = () =>
      {
        playerLosing.innerHTML = `${team.losers ? "L" : ""}`;
        playerLosing.animate(fadeInKeyframes, { duration: 200 });
      };
    };

    //If the score is different, call the correct function
    if (team.score != oldTeam.score)
      OnTeamScoreChange();
      
    //If the number of players of the first player's name/sponsor has changed, call the correct function
    if (Object.keys(team.player).length != Object.keys(oldTeam.player).length ||
      team.player["1"].team != oldTeam.player["1"].team ||
      team.player["1"].name != oldTeam.player["1"].name)
      OnTeamPlayersChanged();

    //If the team's losing status has changed, call the correct function
    if (team.losers != oldTeam.losers)
      OnTeamLosingStatusChanged();
  }

  //Update();
  $(window).on("load", () => {
    $("body").fadeTo(1, 1, async () => {
      Start();
      setInterval(Update, 500);
    });
  });
})(jQuery);
