# Echo client program
import socket
import time

HOST = 'localhost'    # The remote host
PORT = 5000       # The same port as used by the server
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))

flag = 0

allData = ""
count = 0
while(1):
    data = s.recv(1024)
    if "#" not in data and flag == 0:
        allData += data
        continue

    flag = 1

    if "#" in data:
        allData = [x.strip() for x in allData.split("\n")];
        allData = allData[4:]
        continue

    if "$" in data:
        break

    print "Got " + data
    curr = allData[count]
    count += 1
    print "Selecting edge " + curr
    s.sendall('{}'.format(curr))
s.close()
