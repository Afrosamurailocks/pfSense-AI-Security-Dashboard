// Mock diagnostic services
// In a real application, these would trigger backend API calls to the pfSense server.

export const runPing = (host: string): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const isIp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host);
            const resolvedIp = isIp ? host : '172.217.10.14'; // Mock google.com IP
            const output = `
Pinging ${host} [${resolvedIp}] with 32 bytes of data:
Reply from ${resolvedIp}: bytes=32 time=12ms TTL=116
Reply from ${resolvedIp}: bytes=32 time=11ms TTL=116
Reply from ${resolvedIp}: bytes=32 time=12ms TTL=116
Reply from ${resolvedIp}: bytes=32 time=11ms TTL=116

Ping statistics for ${resolvedIp}:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 11ms, Maximum = 12ms, Average = 11ms
            `;
            resolve(output);
        }, 1500);
    });
};

export const runTraceroute = (host: string): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const output = `
Tracing route to ${host} [172.217.10.14]
over a maximum of 30 hops:

  1     2 ms     1 ms     1 ms  10.0.0.1
  2     5 ms     4 ms     5 ms  my-isp-gateway.net [123.45.67.1]
  3    10 ms    11 ms    10 ms  xe-0-1-0.cr1.city.isp.net [203.0.113.5]
  4    12 ms    11 ms    12 ms  ae5.br1.city.isp.net [203.0.113.20]
  5     *        *        *     Request timed out.
  6    15 ms    14 ms    15 ms  108.170.245.1
  7    14 ms    15 ms    14 ms  209.85.248.33
  8    15 ms    14 ms    15 ms  lga25s78-in-f14.1e100.net [172.217.10.14]

Trace complete.
            `;
             resolve(output);
        }, 2500);
    });
};

export const runDnsLookup = (host: string): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const isIp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host);
            let output;
            if (isIp) {
                output = `
Server:  8.8.8.8
Address: 8.8.8.8#53

Non-authoritative answer:
${host}.in-addr.arpa	name = lga25s78-in-f14.1e100.net.
                `;
            } else {
                output = `
Server:  8.8.8.8
Address: 8.8.8.8#53

Non-authoritative answer:
Name:    ${host}
Address: 172.217.10.14
Name:    ${host}
Address: 2607:f8b0:4004:809::200e
                `;
            }
            resolve(output);
        }, 1000);
    });
};

export const runPortTest = (host: string, port: string): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const portNum = parseInt(port, 10);
            const isKnownGoodPort = (portNum === 80 || portNum === 443) && host.includes('google.com');
            const isKnownBadPort = portNum === 22 || portNum > 1024;
            
            let output;
            if (isKnownGoodPort) {
                output = `
Connection to ${host} port ${port} [tcp/*] succeeded!
`;
            } else if (isKnownBadPort) {
                 output = `
Connection to ${host} port ${port} [tcp/*]: Connection timed out
`;
            } else {
                 output = `
Could not connect to ${host} on port ${port}.
Reason: Connection refused.
`;
            }
            resolve(output);
        }, 1200);
    });
};