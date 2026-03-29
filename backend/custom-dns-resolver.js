import dns from 'dns'
import { Resolver } from 'dns'

// Create custom DNS resolver using Cloudflare
const resolver = new Resolver()
resolver.setServers(['1.1.1.1', '1.0.0.1'])

// Override default DNS resolver
dns.setDefaultResultOrder('ipv4first')

// Export for use in other modules
export function setupCustomDNS() {
  // Force Node.js to use custom resolver
  const originalLookup = dns.lookup
  
  dns.lookup = function(hostname, options, callback) {
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    
    // Use custom resolver for MongoDB hostnames
    if (hostname.includes('mongodb.net')) {
      resolver.resolve4(hostname, (err, addresses) => {
        if (err) {
          return callback(err)
        }
        callback(null, addresses[0], 4)
      })
    } else {
      originalLookup(hostname, options, callback)
    }
  }
  
  console.log('✅ Custom DNS resolver configured (Cloudflare 1.1.1.1)')
}
