document.getElementById("myBtn").addEventListener("click", function(){
    let idNum = document.querySelector('#ID').value;
    let url = 'https://cors-anywhere.herokuapp.com/http://www.uschess.org/msa/MbrDtlMain.php?' + idNum;
    let url2 = 'https://cors-anywhere.herokuapp.com/http://www.uschess.org/datapage/gamestats.php?memid=' + idNum;  
    scrape(url, url2, idNum);
});

document.getElementById('myForm').addEventListener('submit', function(e) {
    document.getElementById('myBtn').click();
    e.preventDefault();
}, false);

function scrape(url, url2, idNum) {

    document.querySelector(".loader").style.display = "block";
    document.querySelector(".section1").style.display = "none";

    const request = require('request');
    const cheerio = require('cheerio');

    request(url, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const nameHTML = $('table tbody tr td center table tbody tr td font b');
            const ratingHTML = $('nobr');

            const name = nameHTML.text().substring(10);
            const rating = ratingHTML.text().substring(0, 5);

            request(url2, (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);

                    let recordHTML = $('#content div table:nth-child(5) tbody tr');
                    let rowCount = $('#content div table:nth-child(5) tbody').find('tr').length;
                    console.log(rowCount);

                    if(Number(rating) >= 2200){
                        rowCount -= 5;
                    }
                    else{
                        rowCount -= 4;
                    }

                    for (let x = 0; x < rowCount; x++) {
                        recordHTML = recordHTML.next();
                    }
                    recordHTML = recordHTML.find('td');
                    let record = getRecord(recordHTML);

                    let games = record[0];
                    let wins = record[1];
                    let draws = record[2];
                    let losses = record[3];

                    let winRate = (Number(wins) / Number(games)) * 100;
                    winRate = Math.round(winRate);
                    let drawRate = (Number(draws) / Number(games)) * 100;
                    drawRate = Math.round(drawRate);
                    let lossRate = (Number(losses) / Number(games)) * 100;
                    lossRate = Math.round(lossRate);

                    document.querySelector(".loader").style.display = "none";

                    document.querySelector("#name").innerHTML = "Name: " + name;
                    document.querySelector("#rating").innerHTML = "Rating: " + rating;
                    document.querySelector('#idNum').innerHTML = "ID: " + idNum;

                    document.querySelector("#games").innerHTML = "Games Played: " + games;
                    document.querySelector("#wins").innerHTML = "Wins: " + wins;
                    document.querySelector("#draws").innerHTML = "Draws: " + draws;
                    document.querySelector("#losses").innerHTML = "Losses: " + losses;
                    document.querySelector("#winRate").innerHTML = "Win Rate: " + winRate + "%";
                    document.querySelector("#drawRate").innerHTML = "Draw Rate: " + drawRate + "%";
                    document.querySelector("#lossRate").innerHTML = "Loss Rate: " + lossRate + "%";

                    document.querySelector(".bg-success").style.width = winRate.toString() + "%";
                    document.querySelector(".bg-warning").style.width = drawRate.toString() + "%";
                    document.querySelector(".bg-danger").style.width = (100 - (winRate + drawRate)).toString() + "%";
                    document.querySelector(".section1").style.display = "block";
                }
            });
        }
    });
}
function getRecord(recordHTML){
    let record = recordHTML;

    let games = record.text();
    games = games.substring(0, games.indexOf(" "));

    let wins = record.next().next().text();
    wins = wins.substring(0, wins.indexOf(" "));

    let draws = record.next().next().next().text();
    draws = draws.substring(0, draws.indexOf(" "));

    let losses = record.next().next().next().next().text();
    losses = losses.substring(0, losses.indexOf(" "));

    draws = draws.substring(0, draws.length - losses.length);
    wins = wins.substring(0, wins.length - (draws.length + losses.length));
    games = games.substring(0, games.length - (wins.length + draws.length + losses.length));

    return [games, wins, draws, losses];
}
