import sys
import subprocess
import os
import threading
import time
import socket

fileName = sys.argv[1]
file = open(fileName, 'r')
teams = [x.strip() for x in file.readlines()]
dir_path = os.path.dirname(os.path.realpath(__file__))

def killProcs(proc1,proc2):
	proc1.kill()
	proc2.kill()
	print "Terminated. Code took too long to run"

HOST = 'localhost'    # The remote host
PORT = 5001
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))

for i in range(0,len(teams)-1):
	for j in range(i+1,len(teams)):
		while 1:
			data = s.recv(1024)
			if data == 'start':
				break
		team1 = teams[i]
		team2 = teams[j]
		#run team1 as player and team2 as adversary
		player = "./" + team1 + "_player"
		adversary = "./" + team2 + "_adversary"

		#sending data to server
		s.send(team1 + " " + team2)

		print "Running " + team1 + " " + team2

		os.chdir(dir_path + "/" + team1)
		if(not os.path.isfile(player)):
			player = player + ".sh"
		proc1 = subprocess.Popen("exec " + player, shell = True)
		os.chdir(dir_path)
		time.sleep(2)
		os.chdir(dir_path + "/" + team2)
		if(not os.path.isfile(adversary)):
			adversary = adversary + ".sh"
		proc2 = subprocess.Popen("exec " + adversary, shell = True)
		os.chdir(dir_path)
		timer = threading.Timer(240, killProcs, [proc1,proc2])
		timer.start()
		proc1.communicate()
		proc2.communicate()
		#print "killed the thread"
		timer.cancel()

		#waiting for server to give command
		while 1:
			data = s.recv(1024)
			if data == 'start':
				break

		#run team2 as player and team1 as adversary
		player = "./" + team2 + "_player"
		adversary = "./" + team1 + "_adversary"
		os.chdir(dir_path + "/" + team2)
		if(not os.path.isfile(player)):
			player = player + ".sh"

		#sending data to server
		s.send(team2 + " " + team1)

		proc1 = subprocess.Popen("exec " + player, shell = True)
		os.chdir(dir_path)
		time.sleep(2)
		os.chdir(dir_path + "/" + team1)
		if(not os.path.isfile(adversary)):
			adversary = adversary + ".sh"
		proc2 = subprocess.Popen("exec " + adversary, shell = True)
		os.chdir(dir_path)
		timer = threading.Timer(240.0, killProcs,[proc1,proc2])
		timer.start()
		proc1.communicate()
		proc2.communicate()
		#print "killed the thread"
		timer.cancel()
s.close()
