import { Trans } from "@lingui/macro";
import {
    getPageTitle,
} from "lib/legacy";
import Footer from "components/Footer/Footer";
import skale24Icon from "img/ic_skale_24.svg";
import SEO from "components/Common/SEO";
import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks/account/useGetAccountInfo";

export default function DashboardV2() {
    

    //////////////////////////////////////////////////////////////////////////////////////////
    const { address, account } = useGetAccountInfo();

    const ping = async () => {
        // await sendPingTransaction(pingAmount);
    }

    const pong = async () => {

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
                                    <button className="App-button-option App-card-option default-btn" onClick={() => ping()}>
                                        <Trans>Ping</Trans>
                                    </button>
                                </div>
                                <div className="App-card-row">
                                    <button className="App-button-option App-card-option default-btn" onClick={() => pong()}>
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