import { connect } from 'react-redux';
import { setIpfsIpnsHandlerShouldUpdate } from '../../store/actions';
import IpfsEnable from './ipfs-enable.component';

const mapStateToProps = (state) => {
  const { metamask } = state;
  const {
    ipfsGateway,
    ipfsIpnsEnabled,
    ipfsIpnsHandlerShouldUpdate,
  } = metamask;

  return {
    ipfsGateway,
    ipfsIpnsEnabled,
    ipfsIpnsHandlerShouldUpdate,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setIpfsIpnsHandlerShouldUpdate: (value) => {
      dispatch(setIpfsIpnsHandlerShouldUpdate(value));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IpfsEnable);
