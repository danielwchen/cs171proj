import numpy as np

data = np.loadtxt("testisland.csv",delimiter=",")

x = data.shape[0]
y = data.shape[1]

transformed = np.empty((0,3))

for i in xrange(0,x):
	for j in xrange(0,y):
		transformed = np.concatenate((transformed,np.array([i,j,data[i,j]])[np.newaxis,:]),axis=0)

np.savetxt("testislandxy.csv",transformed)

# plt.pcolor(data)



# plt.show()