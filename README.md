# Shortest Adversial Path - Architecture

Application architecture created for [Heuristics Problem Solving](http://cs.nyu.edu/courses/fall16/CSCI-GA.2965-001/) course at NYU. This architecture is specifically for the problem Shortest Adversial Path.

## Problem Description

A route planner P is to plan a route from some source X to destination Y through a graph whose bi-directional edges have costs. Each time P traverses an edge, P's adversary A knows where P is and can double the cost of any edge. Adversary A can affect the same edge more than once over several turns. P is informed of all changes so has a chance to change the path.

Note however that if P takes the initial graph and takes the shortest path then A might be able to make the narrowest point very expensive.

Both A and P will be told the layout of the graph (which will be fixed for the entire night of the contest) and the source and destination nodes.

The format of the edges of the graph will be
node1, node2

Here is a [typical file](advshort). All edges have an initial cost of 1.

Each team will play P and A in each pairwise contest.

## Running

You need node.js to run this architecture.

Preferred way to install node is using [nvm](https://github.com/creationix/nvm)

or

To install node.js on debian use:

> apt-get install node

or equivalent on your distro.

**Note**: I am using node version 0.12.7. If you have any issues with running or npm, please make sure you are on same version.


After installing node, run `npm install` inside the project directory.

## Game Specifications

Start the server using `node index.js`. Server will start running on port 5000. Pass `-f` argument if you want to change the file

There would be two clients player and adversary. Player would connect first and adversary second. When both connect, server will send the graph structure to both clients.

End of graph edges will marked by a delimiter `#`.

Player has to send the data to server in the following format:

`y`

where y is the next position player wants to move. If `y` is not connected (via edges) to current node of the player, this move will be simply ignored and current location would be sent to the adversary.

Player will also get the data in the following format from server regarding adversary's move:

`x y cost`

where x and y represent the edge whose cost has been doubled and cost represent the cost after doubling.

Adversary has to send the data to server in following format:

`x y`

where x and y represent the edge whose cost has to be doubled. If edge doesn't exist, the move will simply be ignored and player will get the `-1 -1 -1` meaning no edge's cost has been changed (**This must be taken care of by player on his side**)

Adversary will also get the location of player as:

`y`

where y is the current location of the player.

Game's end is specified via a delimiter `$`. If at any point you receive it, you should close the socket connection. Winner will be decided on architecture side.

You can check the test clients in [test-clients](test-clients/) folder.

**Note**: Architecture is a work in progress and will be thorougly tested and completed by the night of competition.

If you find any issues, please feel free to open them using Github issues.

## Sending the code

Your code should be organized in folder which should contain two bash files named as `your_team_name_player` and `your_team_name_adversary`. Put all your files in this folder and name it as `your_team_name`. These bash files should take in as first argument a port number and accordingly call your program to connect on that port number. If not passed it should take default as 5000. Give your bash files executable permissions.
