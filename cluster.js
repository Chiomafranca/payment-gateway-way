import cluster from 'cluster';
import os from 'os';

const numCPUs = os.cpus().length;

export const startCluster = () => {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers for CPU optimization
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    // Restart workers if they die
    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} died, spawning a new one...`);
      cluster.fork();
    });
  }
};
