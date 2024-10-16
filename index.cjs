#! /usr/bin/env node
const https = require('https');

const positionals = process.argv.slice(2);

const username = positionals[0];

const options = {
    hostname: 'api.github.com',
    path: `/users/${username}/events`,
    headers: {
        "User-Agent": 'github-tracker'
    }
}

https.get(options, resp => {
    let data = ''
    resp.on('data', chunk => {
        data += chunk
    })
    resp.on('end', () => {
        let res = JSON.parse(data)
        if (Array.isArray(res)) {
            res.forEach(event => {
                let message;
                switch (event.type) {
                    case 'CommitCommentEvent':
                        message = `${event.payload.action[0].toUpperCase()}${event.payload.action.slice(1)} commit comment in ${event.repo.name}.`;
                        break;
                    case 'CreateEvent':
                        message = `Created ${event.payload.ref_type} in ${event.repo.name}.`;
                        break;
                    case 'DeleteEvent':
                        message = `Deleted ${event.payload.ref_type} in ${event.repo.name}.`;
                        break;
                    case 'ForkEvent':
                        message = `Forked ${event.repo.name}.`;
                        break;
                    case 'PushEvent':
                        message = `Pushed ${event.payload.size} commits to ${event.repo.name}.`;
                        break;
                    case 'IssuesEvent':
                        message = `Issue ${event.payload.action} in ${event.repo.name}.`;
                        break;
                    case 'PullRequestEvent':
                        message = `Pull request ${event.payload.action} in ${event.repo.name}.`;
                        break;
                    case 'WatchEvent':
                        message = `Starred ${event.repo.name}.`;
                        break;
                    default:
                        message = `Event: ${event.type} in ${event.repo.name}.`
                        break;
                }
                console.log(message);
            });
        } else if (res.status == 404) {
            console.log("Invalid username")
        }
    })
}).on('error', err => {
    console.log("Error: ", err.message)
});