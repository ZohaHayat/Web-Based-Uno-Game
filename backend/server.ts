const { Socket } = require( "socket.io");

const express = require("express");
const app = express();
const http = require("http");
const {Server} = require('socket.io')
const cors = require('cors')

app.use(cors())
const server = http.createServer(app)
const io = new Server(
    server,{cors:{
        origin:"http://localhost:3001",
        methods: ["GET", "POST"]
    },
})

server.listen(3001, ()=>{
    console.log("SERVER IS LISTENING ON PORT 3001")
})

const users:any = {};
const counts:any = {};
const names:any[] = [];
let userCount:any = 0;
let start:any;
let curr_player:any;
let rev_bool:any = false;
let skip_bool:any = false;
let startrev_bool:any = false;
let wild_bool:any = false;
let d2_bool:any = false;

let uno_deck = ["R0","R1","R2","R3","R4","R5","R6","R7","R8","R9","R1","R2","R3","R4","R5","R6","R7","R8", "R9",
"B0","B1","B2","B3","B4","B5","B6","B7","B8","B9","B1","B2","B3","B4","B5","B6","B7","B8", "B9",
"Y0","Y1","Y2","Y3","Y4","Y5","Y6","Y7","Y8","Y9","Y1","Y2","Y3","Y4","Y5","Y6","Y7","Y8", "Y9",
"G0","G1","G2","G3","G4","G5","G6","G7","G8","G9","G1","G2","G3","G4","G5","G6","G7","G8", "G9",
"RS","RS","BS","BS","YS","YS","GS","GS",
"RR","RR","BR","BR","YR","YR","GR","GR",
"RD","RD","BD","BD","YD","YD","GD","GD",
"W","W","W","W",
"W4","W4","W4","W4"
]

let player:any = []
let all_player_deck:any = {}

io.on("connection",(socket:any)=>{
    socket.on('userId', (id:any) => {
        if (id in users)
        {
            users[id] = socket.id;
            socket.emit('userCount', counts[id]);
            io.emit('updateCount', counts[id]);
            console.log('Your session has been restored');
        }
        else
        {
            users[id] = socket.id
            userCount = userCount + 1;
            counts[id] = userCount;
            io.emit('updateCount', userCount);
            console.log("connected")
        }
    })

    socket.on("getIndex", (id:any) => {
        socket.emit("returningIndex", counts[id])
    })

    socket.on("getDeck", (temp:any) => {
        if (all_player_deck[temp] == undefined)
        {
            while (player.length < 7) 
            {
                const randomIndex = Math.floor(Math.random() * uno_deck.length);
                const randomElement = uno_deck[randomIndex];
                player.push(randomElement);
                uno_deck.splice(randomIndex, 1);
            }
            all_player_deck[temp] = player
        }
        socket.emit("myDeck",all_player_deck[temp])
        player = []
    })

    console.log("user connected with a socket id", socket.id)
    //add custom events here
    socket.on('myName',(myName:any) =>{
        names.push(myName)
        if (names.length == 4)
        {
            const randomIndex = Math.floor(Math.random() * uno_deck.length);
            const randomElement = uno_deck[randomIndex];
            uno_deck.splice(randomIndex, 1);
            start = randomElement
            io.emit("gamestart", [randomElement])
            socket.emit("gamestart", [randomElement])
            io.emit("nameslist", names)

            for (let key in counts)
            {
                if (counts[key] == 1)
                {
                    let player_id = users[key]
                    let player_name = names[0]
                    curr_player = 1
                    io.emit("playerTurn", {"player_name":player_name, "id":key})
                }
            }
        }
        console.log('Received myMessage:', myName);
    })

    socket.on("nextturn",() => {
        if (rev_bool == false)
        {
            if (curr_player == 4)
            {
                curr_player = 0
            }
            curr_player = curr_player + 1
        }
        else if (rev_bool == true)
        {
            if (curr_player == 1)
            {
                curr_player = 5
            }
            curr_player = curr_player - 1
        }
        for (let key in counts)
        {
            if (counts[key] == curr_player)
            {
                let player_id = users[key]
                let player_name = names[curr_player-1]
                io.emit("playerTurn", {"player_name":player_name, "id":key})
            }
        }
    })

    socket.on("pick", (data:any) => {
        if (uno_deck.length == 0)
        {
            io.emit("draw")
            io.close()
        }
        let id = data["propid"]
        let deck = data["deck"]
        let temp = deck

        const randomIndex = Math.floor(Math.random() * uno_deck.length);
        const randomElement = uno_deck[randomIndex];
        temp.push(randomElement);
        uno_deck.splice(randomIndex, 1);
        socket.emit("newDeck", temp)
        if (uno_deck.length == 0)
        {
            io.emit("draw")
        }
        all_player_deck[id] = temp
    })

    socket.on("pass", () => {
        if (rev_bool == false)
        {
            if (curr_player == 4)
            {
                curr_player = 0
            }
            curr_player = curr_player + 1
        }
        else if (rev_bool == true)
        {
            if (curr_player == 1)
            {
                curr_player = 5
            }
            curr_player = curr_player - 1
        }
        for (let key in counts)
        {
            if (counts[key] == curr_player)
            {
                let player_id = users[key]
                let player_name = names[curr_player-1]
                io.emit("playerTurn", {"player_name":player_name, "id":key})
            }
        }
    })

    socket.on("reverse", () => {
        if (rev_bool == false)
        {
            rev_bool = true
        }
        else if (rev_bool == true)
        {
            rev_bool = false
        }

        if (rev_bool == false)
        {
            if (curr_player == 4)
            {
                curr_player = 0
            }
            curr_player = curr_player + 1
        }
        else if (rev_bool == true)
        {
            if (curr_player == 1)
            {
                curr_player = 5
            }
            curr_player = curr_player - 1
        }
        for (let key in counts)
        {
            if (counts[key] == curr_player)
            {
                let player_id = users[key]
                let player_name = names[curr_player-1]
                io.emit("playerTurn", {"player_name":player_name, "id":key})
            }
        }
    })

    socket.on("draw2", (data:any) => {
        if (d2_bool == false)
        {
        let id = data["propid"]
        let temp = data["deck"]
        let count = 0

        while (count < 2)
        {
            const randomIndex = Math.floor(Math.random() * uno_deck.length);
            const randomElement = uno_deck[randomIndex];
            temp.push(randomElement);
            uno_deck.splice(randomIndex, 1);
            count = count + 1
        }
        all_player_deck[id] = temp
        d2_bool = true
        socket.emit("newDeck", temp)
        if (uno_deck.length == 0)
        {
            io.emit("draw")
        }
        }
    })

    socket.on("draw4", (data:any) => {
        if (wild_bool == false)
        {
        let id = data["propid"]
        let temp = data["deck"]
        let count = 0

        while (count < 4)
        {
            const randomIndex = Math.floor(Math.random() * uno_deck.length);
            const randomElement = uno_deck[randomIndex];
            temp.push(randomElement);
            uno_deck.splice(randomIndex, 1);
            count = count + 1
        }
        all_player_deck[id] = temp
        socket.emit("newDeck", temp)
        if (uno_deck.length == 0)
        {
            io.emit("draw")
        }

        if (rev_bool == false)
        {
            if (curr_player == 4)
            {
                curr_player = 0
            }
            curr_player = curr_player + 1
        }
        else if (rev_bool == true)
        {
            if (curr_player == 1)
            {
                curr_player = 5
            }
            curr_player = curr_player - 1
        }
        for (let key in counts)
        {
            if (counts[key] == curr_player)
            {
                let player_id = users[key]
                let player_name = names[curr_player-1]
                wild_bool = true
                io.emit("playerTurn", {"player_name":player_name, "id":key})
            }
        }
    }
    })

    socket.on("gameEnd", (id:any) => {
        let val = counts[id]
        let winner = names[val-1]
        io.emit("winner", winner)
        io.close()
    })

    socket.on("newstart", (st:any) => {
        io.emit("changestart", st)
    })

    socket.on("startplayed", () => {
        io.emit("starthasplayed")
    })

    socket.on("skip_played", () => {
        io.emit("skiphasplayed")
    })

    socket.on("revplayed", () => {
        io.emit("revhasplayed")
    })

    socket.on("wildplayed", () => {
        io.emit("wildhasplayed")
    })

    socket.on("newskip", () => {
        skip_bool = false
        io.emit("newskipishere")
    })

    socket.on("newrev", () => {
        startrev_bool = false
        io.emit("newrevishere")
    })

    socket.on("newdraw", () => {
        d2_bool = false
        io.emit("newdrawishere")
    })

    socket.on("wildnow", () => {
        wild_bool = false
        io.emit("wildishere")
    })

    socket.on("d2played", () => {
        io.emit("d2hasplayed")
    })

    socket.on("startskip", () => {
        if (skip_bool == false)
        {
            if (rev_bool == false)
            {
                if (curr_player == 4)
                {
                    curr_player = 0
                }
                curr_player = curr_player + 1
            }
            else if (rev_bool == true)
            {
                if (curr_player == 1)
                {
                    curr_player = 5
                }
                curr_player = curr_player - 1
            }
            for (let key in counts)
            {
                if (counts[key] == curr_player)
                {
                    let player_id = users[key]
                    let player_name = names[curr_player-1]
                    skip_bool = true
                    io.emit("playerTurn", {"player_name":player_name, "id":key})
                }
            }
        }
    })

    socket.on("startreverse", () => {
        if (startrev_bool == false)
        {
        if (rev_bool == false)
        {
            rev_bool = true
        }
        else if (rev_bool == true)
        {
            rev_bool = false
        }

        if (rev_bool == false)
        {
            if (curr_player == 4)
            {
                curr_player = 0
            }
            curr_player = curr_player + 1
        }
        else if (rev_bool == true)
        {
            if (curr_player == 1)
            {
                curr_player = 5
            }
            curr_player = curr_player - 1
        }
        for (let key in counts)
        {
            if (counts[key] == curr_player)
            {
                let player_id = users[key]
                let player_name = names[curr_player-1]
                startrev_bool = true
                io.emit("playerTurn", {"player_name":player_name, "id":key})
            }
        }
    }
    })

    socket.on("wildnext", () => {
        if (wild_bool == false)
        {
            if (rev_bool == false)
            {
                if (curr_player == 4)
                {
                    curr_player = 0
                }
                curr_player = curr_player + 1
            }
            else if (rev_bool == true)
            {
                if (curr_player == 1)
                {
                    curr_player = 5
                }
                curr_player = curr_player - 1
            }
            for (let key in counts)
            {
                if (counts[key] == curr_player)
                {
                    let player_id = users[key]
                    let player_name = names[curr_player-1]
                    wild_bool = true
                    io.emit("playerTurn", {"player_name":player_name, "id":key})
                }
            }
        }
    })

    if (uno_deck.length == 0)
    {
        io.emit("draw")
    }

    socket.on("newmsg", (msg:any) => {
        io.sockets.emit("newmsghere", msg)
    })

    socket.on("newmsg2", (msg:any) => {
        socket.emit("newmsghere2", msg)
    })
})