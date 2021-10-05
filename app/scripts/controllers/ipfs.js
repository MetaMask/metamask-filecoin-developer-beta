import { ObservableStore } from '@metamask/obs-store';

const DEFAULT_IPFS_IPNS_ENABLED = false;

export default class IpfsIpnsController {
  constructor() {
    const initState = {
      ipfsIpnsEnabled: DEFAULT_IPFS_IPNS_ENABLED,
      ipfsIpnsHandlerShouldUpdate: false,
    };
    this.store = new ObservableStore(initState);
  }

  /**
   * @param {boolean} status - indicates if ipfs ipns resolving is enabled
   * @returns status of ipfs ipns url resolving
   */
  setIpfsIpnsUrlResolving(status) {
    this.store.updateState({
      ipfsIpnsEnabled: status,
    });
    return Promise.resolve(status);
  }

  /**
   * @param {boolean} bool - indicates if protocol handler should be updated
   * @returns bool
   */
  setIpfsIpnsHandlerShouldUpdate(bool) {
    this.store.updateState({ ipfsIpnsHandlerShouldUpdate: bool });
    return Promise.resolve(bool);
  }
}
