import { ethErrors } from 'eth-rpc-errors';
import { isEqual } from 'lodash';

const FILSNAP = 'filsnap';
const WALLET_PLUGIN = 'wallet_plugin';

/**
 * Returns a middleware that restricts plugin-related methods for the purposes
 * the Filecoin developer beta.
 *
 * We attenuate:
 * - wallet_enable
 * - wallet_installPlugins
 * - wallet_invokePlugin
 *
 * We don't attenuate:
 * - snap_getAppKey, which is restricted to plugins only, and therefore only
 *   filsnap.
 * - wallet_getPlugins, which is read-only and therefore harmless.
 */
export default function createFilecoinBetaAttenuationMiddleware() {
  return (req, _res, next, end) => {
    switch (req.method) {
      // wallet_enable can be used for other things than installing plugins, which
      // is fine. We just want to prevent it invoking any plugin other than
      // filsnap.
      case 'wallet_enable': {
        const requestedPermissions = req.params?.[0] || {};
        if (
          WALLET_PLUGIN in requestedPermissions &&
          !filsnapIsOnlyKey(requestedPermissions[WALLET_PLUGIN])
        ) {
          return end(getFilsnapOnlyError());
        }
        break;
      }

      case 'wallet_installPlugins': {
        if (!filsnapIsOnlyKey(req.params?.[0] || {})) {
          return end(getFilsnapOnlyError());
        }
        break;
      }

      case 'wallet_invokePlugin': {
        if (req.params?.[0] !== FILSNAP) {
          return end(getFilsnapOnlyError());
        }
        break;
      }

      default: {
        return next();
      }
    }
    return next();
  };
}

function filsnapIsOnlyKey(obj) {
  return isEqual([FILSNAP], Object.keys(obj));
}

function getFilsnapOnlyError() {
  throw ethErrors.rpc.invalidParams({
    message:
      'This is the MetaMask Filecoin developer beta. Plugin methods may only invoke "filsnap".',
  });
}
