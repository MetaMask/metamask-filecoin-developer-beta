import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { IPFS_IPNS_URL_RESOLVING } from '../../helpers/constants/routes';

export default class IpfsEnable extends PureComponent {
    static contextTypes = {
        t: PropTypes.func
    }
 
    static propType = {
        ipfsGateway: PropTypes.string.isRequired,
        ipfsIpnsEnabled: PropTypes.bool.isRequired,
        ipfsIpnsHandlerShouldUpdate: PropTypes.bool.isRequired,
        setIpfsIpnsHandlerShouldUpdate: PropTypes.func,
    }

    state = {
        ipfsGateway: this.props.ipfsGateway,
        ipfsIpnsIsEnabled: this.props.ipfsIpnsEnabled,
        ipfsIpnsHandlerShouldUpdate: this.props.ipfsIpnsHandlerShouldUpdate,
    }

    componentDidMount() {
        const {
            ipfsIpnsEnabled,
            ipfsIpnsHandlerShouldUpdate,
        } = this.props;

        if(ipfsIpnsHandlerShouldUpdate) {
            const page = IPFS_IPNS_URL_RESOLVING.replace("/", "");
            if(ipfsIpnsEnabled) {
                this.registerHandlers(page);
            } else {
                this.unregisterHandlers(page);
            }
            this.props.setIpfsIpnsHandlerShouldUpdate(false);
        }
    }

    registerHandlers(page) {
        window.navigator.registerProtocolHandler(
            "ipfs", 
            window.location.href.replace(`/home.html#${page}`, "/%s"), 
            "Ipfs handler",
        );
        window.navigator.registerProtocolHandler(
            "ipns", 
            window.location.href.replace(`/home.html#${page}`, "/%s"), 
            "Ipns handler",
        );
    }

    unregisterHandlers(page) {
        window.navigator.unregisterProtocolHandler(
            "ipfs", 
            window.location.href.replace(`/home.html#${page}`, "/%s"),
        );
        window.navigator.unregisterProtocolHandler(
            "ipns", 
            window.location.href.replace(`/home.html#${page}`, "/%s"),
        );
    }

    render() {
        const { t } = this.context;
        const ipfsIpnsDescriptionParts = t('ipfsIpnsDescription').split("#");
        const ipfsIpnsExampleParts = t('ipfsIpnsExample').split("#");
        return (
            <div className="main-container">
                <div className="ipfs-enable__container">
                    <div className="ipfs-enable__main-view">
                        <div className="ipfs-enable__menu">
                            <div className="ipfs-enable__title">
                                {t('ipfsIpnsResolvingTitle')}
                            </div>
                        </div>
                        <div className="ipfs-enable__content">
                            <span></span>
                            <div className = "ipfs-enable__content-row">
                                <div className = "ipfs-enable__content-item">
                                    <span>
                                        {t('ipfsIpnsResolvingTitle')}
                                    </span>
                                    <div className="ipfs-enable__description">
                                        {this.state.ipfsIpnsIsEnabled ? "Enabled" : "Disabled"}
                                    </div>
                                </div>
                                <div className = "ipfs-enable__content-item">
                                    <span>
                                        {t('ipfsGateway')}
                                    </span>
                                    <div className="ipfs-enable__description">
                                        {this.state.ipfsGateway}
                                    </div>                            
                                </div>
                                <div className = "ipfs-enable__content-item">
                                    <span>
                                        {t('example')}
                                    </span>
                                    <div className="ipfs-enable__description">
                                        {ipfsIpnsDescriptionParts[0]} <span className="highlight">ipfs://</span> {ipfsIpnsDescriptionParts[1]} <span className="highlight">ipns://</span>
                                        {ipfsIpnsDescriptionParts[2]}
                                    </div>
                                    <div className="ipfs-enable__description">
                                        {ipfsIpnsExampleParts[0]} <span className="highlight">ipfs://[CID]/</span> {ipfsIpnsExampleParts[1]} <span className="highlight">https://ipfs.io/ipfs/[CID]/</span> .
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}