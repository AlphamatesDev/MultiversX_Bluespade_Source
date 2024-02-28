import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import SuperGlp from "components/Glp/SuperGlp";
import Footer from "components/Footer/Footer";
import "./SuperGlpRewards.css";

// import { Trans } from "@lingui/macro";
// import { useChainId } from "lib/chains";
// import ExternalLink from "components/ExternalLink/ExternalLink";
// import { t } from "@lingui/macro";

export default function SuperGlpRewards(props) {
  const history = useHistory();
  const [isBuying, setIsBuying] = useState(true);

  useEffect(() => {
    const hash = history.location.hash.replace("#", "");
    const buying = hash === "redeem" ? false : true;
    setIsBuying(buying);
  }, [history.location.hash]);

  return (
    <div className="default-container page-layout Buy-sell-blp">
      <SuperGlp {...props} isBuying={isBuying} setIsBuying={setIsBuying} />
      <Footer />
    </div>
  );
}
