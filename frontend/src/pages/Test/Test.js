import { Trans } from "@lingui/macro";
import {
    getPageTitle,
} from "lib/legacy";
import Footer from "components/Footer/Footer";
import skale24Icon from "img/ic_skale_24.svg";
import SEO from "components/Common/SEO";
import { useGetAccountInfo } from "hooks";
import { useGetContractValue } from "lib/contracts";
import { getContract } from "config/contracts"
import { MULTIVERSX } from "config/chains";
import { useGetNetworkConfig } from 'hooks';
import { Address, AddressValue } from 'lib/contracts/utils';
import { useSendPingPongTransaction } from "lib/contracts/callContractMX";

export default function DashboardV2() {
    //////////////////////////////////////////////////////////////////////////////////////////
    const { address, account } = useGetAccountInfo();

    const pingPongAddress = getContract(MULTIVERSX, "PingPong");

    const { network } = useGetNetworkConfig();
    const pingAmount = useGetContractValue(network, pingPongAddress, "getPingAmount");

    const hexAddress = new AddressValue(new Address(address)).valueOf().hex();
    const timeToPong = useGetContractValue(network, pingPongAddress, "getTimeToPong", [hexAddress]);

    const { sendTransaction, transactionStatus } = useSendPingPongTransaction('rawPingPongSessionId');

    console.log("eagle transactionStatus = ", transactionStatus)

    const ping = async () => {
        await sendTransaction(pingPongAddress, "ping", pingAmount)
    }

    const pong = async () => {
        await sendTransaction(pingPongAddress, "pong", 0)
    }
    //////////////////////////////////////////////////////////////////////////////////////////

    return (
        <SEO title={getPageTitle("Dashboard")}>
            <div className="default-container DashboardV2 page-layout">
                <div className="hero-section">
                    <div className="section-title-block">
                        <div className="section-title-content">
                            <div className="Page-title">
                                <Trans>Test</Trans>
                                <img src={skale24Icon} alt="skale24Icon" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="DashboardV2-content">
                    <div className="DashboardV2-cards">
                        <div className="App-card">
                            <div className="App-card-title">
                                <Trans>Account</Trans>
                            </div>
                            <div className="App-card-divider"></div>
                            <div className="App-card-content">
                                <div className="App-card-row">
                                    <div className="label">
                                        <Trans>Address</Trans>
                                    </div>
                                    <div>
                                        {address}
                                    </div>
                                </div>
                                <div className="App-card-row">
                                    <div className="label">
                                        <Trans>Herotag</Trans>
                                    </div>
                                    <div>
                                        {account.username}
                                    </div>
                                </div>
                                <div className="App-card-row">
                                    <div className="label">
                                        <Trans>Shard</Trans>
                                    </div>
                                    <div>
                                        {account.shard}
                                    </div>
                                </div>
                                <div className="App-card-row">
                                    <div className="label">
                                        <Trans>Balance</Trans>
                                    </div>
                                    <div>
                                        {account.balance}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="App-card">
                            <div className="App-card-title">
                                <Trans>Ping & Pong (Manual)</Trans>
                            </div>
                            <div className="App-card-divider"></div>
                            <div className="App-card-content">
                                <div className="App-card-row">
                                    <div className="label">
                                        <Trans>Ping Amount</Trans>
                                    </div>
                                    <div>
                                        {pingAmount}
                                    </div>
                                </div>
                                <div className="App-card-row">
                                    <div className="label">
                                        <Trans>Ping Time</Trans>
                                    </div>
                                    <div>
                                        {timeToPong}
                                    </div>
                                </div>
                                <div className="App-card-row">
                                    <button className="App-button-option App-card-option default-btn" onClick={ping}>
                                        <Trans>Ping</Trans>
                                    </button>
                                </div>
                                <div className="App-card-row">
                                    <button className="App-button-option App-card-option default-btn" onClick={pong}>
                                        <Trans>Pong</Trans>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </SEO>
    );
}