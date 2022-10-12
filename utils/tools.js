'use strict';

//this function returns the local ip

function getLocalIp() {
    let url;

    const { networkInterfaces } = require('os');

    const nets = networkInterfaces();

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            if (net.family === familyV4Value && !net.internal) {
                return url = net.address;
            }
        }
    }
    
    return '0.0.0.0';
}

module.exports = [getLocalIp]