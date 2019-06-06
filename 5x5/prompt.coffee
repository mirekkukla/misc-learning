GRID_SIZE = 5
stdin = process.openStdin()
stdin.setEncoding 'utf8'

inputCallback = null
stdin.on 'data', (input) -> inputCallback input

promptForTile1 = ->
  console.log "Please enter coordinates for the first tile."
  inputCallback = (input) ->
    promptForTile2() if strToCoordinates input

promptForTile2 = ->
  console.log "Please enter coordinates for the second tile."
  inputCallback = (input) ->
    if strToCoordinates input
      console.log "Swapping tiles... done!"
      promptForTile1()

inRange = (x, y) ->
  1 <= x <= GRID_SIZE and 1 <= y <= GRID_SIZE

isInteger = (num) ->
  num is Math.round(num)

strToCoordinates = (input) ->
  halves = input.split(',')
  if halves.length == 2
    x = parseFloat(halves[0])
    y = parseFloat(halves[1])
    if !isInteger(x) or !isInteger(y)
      console.log "Each coordinate must be an integer"
    else if not inRange x, y
      console.log "Each coordnate must be between 1 and #{GRID_SIZE}."
    else
      {x, y}
  else
    console.log "Input must be of the form `x,y`."

console.log "Welcome to 5x5!"
promptForTile1()
