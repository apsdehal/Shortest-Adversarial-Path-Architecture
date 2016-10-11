import sys
import subprocess

fileName = sys.argv[1] 
file = open(fileName, 'r')
teams = [x.strip() for x in file.readlines()]

for i in range(0,len(teams)-1):
	for j in range(i+1,len(teams)):
		team1 = teams[i]
		team2 = teams[j]
		#run team1 as player and team2 as adversary
		player = "./" + team1 + "/" + team1 + "_player.sh"
		adversary = "./" + team2 + "/" + team2 + "_adversary.sh"
		subprocess.call(player, shell=True)
		subprocess.call(adversary, shell=True)
		#run team2 as player and team1 as adversary
		player = "./" + team2 + "/" + team2 + "_player.sh"
		adversary = "./" + team1 + "/" + team1 + "_adversary.sh"
		subprocess.call(player, shell=True)
		subprocess.call(adversary, shell=True)