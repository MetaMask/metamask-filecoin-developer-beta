import extension from 'extensionizer';
import getFetchWithTimeout from '../../../../shared/modules/fetch-with-timeout';
import resolveEnsToIpfsContentId from './resolver';

const fetchWithTimeout = getFetchWithTimeout(30000);

const supportedTopLevelDomains = ['eth'];
const supportedProtocols = ['ipfs', 'ipns'];

export default function setupEnsIpfsResolver({
  provider,
  getCurrentChainId,
  getIpfsGateway,
  // install listener
}) {
  const urlPatterns = supportedTopLevelDomains.map((tld) => `*://*.${tld}/*`);

  extension.webRequest.onErrorOccurred.addListener(webRequestDidFail, {
    types: ['main_frame'],
    urls: urlPatterns,
  });

  extension.webRequest.onBeforeRequest.addListener(catchIpfsChromeExt, {
    types: ['main_frame'],
    urls: ['chrome-extension://*/*'],
  });

  // return api object
  return {
    // uninstall listener
    remove() {
      extension.webRequest.onErrorOccurred.removeListener(webRequestDidFail);
      extension.webRequest.onBeforeRequest.removeListener(catchIpfsChromeExt);
    },
  };

  async function catchIpfsChromeExt(details) {
    const { tabId, url } = details;
    // ignore requests that are not associated with tabs
    if (tabId === -1) {
      return;
    }

    const unUrl = unescape(url);
    supportedProtocols.forEach((protocol) => {
      if (unUrl.includes(`${protocol}:`)) {
        const identifier = unUrl.split(`${protocol}:`)[1];
        const ipfsGateway = getIpfsGateway();
        const newUrl = `https://${ipfsGateway}/${protocol}${identifier}`;
        extension.tabs.update(tabId, { url: newUrl });
      }
    });
  }

  async function webRequestDidFail(details) {
    const { tabId, url } = details;
    // ignore requests that are not associated with tabs
    // only attempt ENS resolution on mainnet
    if (tabId === -1 || getCurrentChainId() !== '0x1') {
      return;
    }
    // parse ens name
    const { hostname: name, pathname, search, hash: fragment } = new URL(url);
    const domainParts = name.split('.');
    const topLevelDomain = domainParts[domainParts.length - 1];

    // if unsupported TLD, abort
    if (!supportedTopLevelDomains.includes(topLevelDomain)) {
      return;
    }

    // otherwise attempt resolve
    attemptResolve({ tabId, name, pathname, search, fragment });
  }

  async function attemptResolve({ tabId, name, pathname, search, fragment }) {
    const ipfsGateway = getIpfsGateway();
    extension.tabs.update(tabId, { url: `loading.html` });
    let url = `https://app.ens.domains/name/${name}`;
    try {
      const { type, hash } = await resolveEnsToIpfsContentId({
        provider,
        name,
      });
      if (type === 'ipfs-ns' || type === 'ipns-ns') {
        const resolvedUrl = `https://${hash}.${type.slice(
          0,
          4,
        )}.${ipfsGateway}${pathname}${search || ''}${fragment || ''}`;
        try {
          // check if ipfs gateway has result
          const response = await fetchWithTimeout(resolvedUrl, {
            method: 'HEAD',
          });
          if (response.status === 200) {
            url = resolvedUrl;
          }
        } catch (err) {
          console.warn(err);
        }
      } else if (type === 'swarm-ns') {
        url = `https://swarm-gateways.net/bzz:/${hash}${pathname}${
          search || ''
        }${fragment || ''}`;
      } else if (type === 'onion' || type === 'onion3') {
        url = `http://${hash}.onion${pathname}${search || ''}${fragment || ''}`;
      } else if (type === 'zeronet') {
        url = `http://127.0.0.1:43110/${hash}${pathname}${search || ''}${
          fragment || ''
        }`;
      }
    } catch (err) {
      console.warn(err);
    } finally {
      extension.tabs.update(tabId, { url });
    }
  }
}
