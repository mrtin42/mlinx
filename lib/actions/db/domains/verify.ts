'use server';

import axios from "axios";
import { Resolver } from "dns/promises";
import { print } from "@/lib/utils";
const dig = new Resolver();
dig.setServers(["1.1.1.1", "1.0.0.1"]);

interface Domain {
    domain: string,
    connType: 'A' | 'CNAME',
    ownerId: string,
}

if (process.env.NEXT_PUBLIC_ENV === 'development') {
    var verifyDNS = async (domains: Array<Domain>): Promise<any> => {
        print(domains);
        let results = [];
        for (const domain of domains) {
            const onCloudflare = await dig.resolveNs(domain.domain);
            print(onCloudflare);
            if (onCloudflare[0].includes('ns.cloudflare.com') || onCloudflare[0].includes('cloudflare.net')) {
                const x = await dig.resolve4(domain.domain);
                const res = await axios.get(`https://${x[0]}/_nslookup/trace`, { headers: { host: domain.domain } });
                print(res);
                if (res.data.status) {
                    results.push({domain: domain.domain, status: true, conn: 'A', addresses: ['This domain is correctly pointing to mlinx\'s servers via Cloudflare\'s proxy.']});
                }
            } else {
                switch (!domain.domain.split('.')[2]) {
                    case true: {
                        try {
                            const res = await dig.resolve4(domain.domain);
                            print(res);
                            // regex pattern to test if the resolved IP address is a Vercel IP address (begins with 76.76.21 and ends with anything between 1 and 255)
                            if (/^76\.76\.21\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(res[0])) {
                                results.push({domain: domain.domain, status: true, conn: 'A', addresses: res});
                            } else {
                                results.push({domain: domain.domain, status: false, conn: 'A', error: 'resolvedInvalid'});
                            }
                        } catch (e) {
                            results.push({domain: domain.domain, status: false, conn: 'A', error: 'resolverError'});
                        }
                        break;
                    }
                    case false: {
                        try {
                            const res = await dig.resolveCname(domain.domain);
                            print(res);
                            if (/^cname\.(vercel-dns|martin-dns)\.com$/.test(res[0])) {
                                results.push({domain: domain.domain, status: true, conn: 'CNAME', address: res});
                            } else {
                                results.push({domain: domain.domain, status: false, conn: 'CNAME', error: 'resolvedInvalid'});
                            }
                        } catch (e) {
                            results.push({domain: domain.domain, status: false, conn: 'CNAME', error: 'resolverError'});
                        }
                        break;
                    } 
                    default: {
                        results.push({domain: domain.domain, status: false, error: 'invalidConnType'});
                    }
                }
            }
        }
        print(results);
        return results;
    }
} else {
    var verifyDNS = async (domains: Array<Domain>): Promise<any> => {
        print(domains);
        let results = []; 
        for (const domain of domains) {
            const onCloudflare = await dig.resolveNs(domain.domain);
            print(onCloudflare);
            if (onCloudflare[0].includes('ns.cloudflare.com') || onCloudflare[0].includes('cloudflare.net')) {
                const x = await dig.resolve4(domain.domain);
                const res = await axios.get(`https://${x[0]}/_nslookup/trace`, { headers: { host: domain.domain } });
                print(res);
                if (res.data.status) {
                    results.push({domain: domain.domain, status: true, conn: 'A', addresses: ['This domain is correctly pointing to mlinx\'s servers via Cloudflare\'s proxy.']});
                }
            } else {
                try {
                    const res = await axios.get(`https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain.domain}`, {
                        headers: {
                            Authorization: `Bearer ${process.env.VERCEL_TOKEN}`
                        }
                    });
                    print(res);
                    const { verified, verification } = res.data;
                    if (verified) {
                        if (!domain.domain.split('.')[2]) {
                            const res = await dig.resolve4(domain.domain);
                            print(res);
                            if (/^76\.76\.21\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(res[0])) {
                                results.push({domain: domain.domain, status: true, conn: 'A', addresses: res});
                            } else {
                                results.push({domain: domain.domain, status: false, conn: 'A', error: 'resolvedInvalid'});
                            }
                        } else { 
                            const res = await dig.resolveCname(domain.domain);
                            print(res);
                            if (/^cname\.vercel-dns\.com$/.test(res[0])) {
                                results.push({domain: domain.domain, status: true, conn: 'CNAME', address: res});
                            } else {
                                results.push({domain: domain.domain, status: false, error: 'resolvedInvalid'});
                            }
                        }
                    } else {
                        results.push({domain: domain.domain, status: false, error: 'unverified', verification: verification[0]});
                    }
                } catch (e) {
                    results.push({domain: domain.domain, status: false, error: 'apiError'});
                }
            }
        }
        print(results);
        return results;
    }
}

export default verifyDNS;

/**
 * the above function is used to verify the DNS of a domain
 * 
 * if the environment is development, the function will use the dns/promises module to resolve the domain, otherwise Vercel's API will be used
 * 
 * example: verifyDNS([{domain: "example.com", connType: "A", ownerId: "1234"}, {domain: "example2.com", connType: "CNAME", ownerId: "1234"}, {domain: "example3.com", connType: "A", ownerId: "1234"}])
 * 
 * if example.com had a valid A record, example2.com had a valid CNAME record, and example3.com had an invalid A record, the function would return:
 * [
 *  {domain: "example.com", status: true},
 *  {domain: "example2.com", status: true},
 *  {domain: "example3.com", status: false, error: "resolvedInvalid"}
 * ]
 * 
 */


    