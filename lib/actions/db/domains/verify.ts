'use server';

import axios from "axios";
import { Resolver } from "dns/promises";
import { print } from "@/lib/utils";
const resolver = new Resolver();
resolver.setServers(["1.1.1.1", "1.0.0.1"]);

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
            switch (domain.connType) {
                case 'A': {
                    try {
                        const res = await resolver.resolve4(domain.domain);
                        print(res);
                        if (/76\.76\.21\.(21|61|93|98)$/.test(res[0])) {
                            results.push({domain: domain.domain, status: true, addresses: res});
                        } else {
                            results.push({domain: domain.domain, status: false, error: 'resolvedInvalid'});
                        }
                    } catch (e) {
                        results.push({domain: domain.domain, status: false, error: 'resolverError'});
                    }
                    break;
                }
                case 'CNAME': {
                    try {
                        const res = await resolver.resolveCname(domain.domain);
                        print(res);
                        if (/^cname\.(vercel-dns|martin-dns)\.com$/.test(res[0])) {
                            results.push({domain: domain.domain, status: true, address: res});
                        } else {
                            results.push({domain: domain.domain, status: false, error: 'resolvedInvalid'});
                        }
                    } catch (e) {
                        results.push({domain: domain.domain, status: false, error: 'resolverError'});
                    }
                    break;
                } 
                default: {
                    results.push({domain: domain.domain, status: false, error: 'invalidConnType'});
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
            try {
                const res = await axios.get(`https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain.domain}`, {
                    headers: {
                        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`
                    }
                });
                print(res);
                const { verified, verification } = res.data;
                if (verified) {
                    results.push({domain: domain.domain, status: true});
                } else {
                    results.push({domain: domain.domain, status: false, error: 'unverified', verification});
                }
            } catch (e) {
                results.push({domain: domain.domain, status: false, error: 'apiError'});
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


    