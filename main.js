const axios = require("axios");
const inquirer = require("inquirer");
const htmlPdf = require("html-pdf");
let color

let username

let userId



const fs = require("fs")

const generateHtml = require("./index")



function questions() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is your Github username?",
            name: "username"
        },
        {
            type: "input",
            message: "What is your favorite color",
            name: "color"
        }
    ]).then(function (userInput) {

        console.log(userInput.username, userInput.color)

        username = userInput.username
        color = userInput.color
        axios.get("https://api.github.com/users/" + username)
            .then(function (response) {
                console.log(response.data)
                let name = response.data.name
                
                let userLocation = response.data.location
                let repos = response.data.public_repos
                let followers = response.data.followers
                let following = response.data.following
                let company = response.data.company
                
                axios.get("https://api.github.com/users/" + username + "/starred").then(function (response2) {
                    console.log(response2.data)


                    var options = { format: 'A3' };

                    let userId = response2.data[0].owner.id
                    let stars = response2.data.stargazers_count

                    var htmlstr = generateHtml({
                        name: name,
                        userLocation: userLocation,
                        repos: repos,
                        followers: followers,
                        following: following,
                        picture: "https://avatars3.githubusercontent.com/u/" + userId + "?v=4",
                        stars: stars,
                        color: userInput.color,
                        company: company
                    })
                    fs.writeFile("main.html", htmlstr, function (err) {
                        if (err) {
                            throw err
                        }

                    })
                    // htmlPdf.create(htmlstr, options).toFile('./businesscard.pdf', function (err, res) {
                    //     if (err) return console.log(err);
                    //     console.log(res); // { filename: '/app/businesscard.pdf' }
                    // });h
                })

            })
    })
}
questions()