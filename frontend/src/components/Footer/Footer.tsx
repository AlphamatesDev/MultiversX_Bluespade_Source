import React from "react";
import cx from "classnames";
// import { t } from "@lingui/macro";
import { useMedia } from "react-use";
import "./Footer.css";
// import logoImg from "img/ic_gmx_footer.svg";
import twitterIcon from "img/twitter_icon.svg";
import discordIcon from "img/discord_icon.svg";
import telegramIcon from "img/telegram_icon.svg";
// import gitbookIcon from "img/ic_gitbook.svg";
// import githubIcon from "img/ic_github.svg";
import mediumIcon from "img/medium_icon.svg";
// import { NavLink } from "react-router-dom";
import { isHomeSite } from "lib/legacy";

// const footerLinks = {
//   home: [
//     { text: t`Terms and Conditions`, link: "/terms-and-conditions" },
//     { text: t`Referral Terms`, link: "https://bluespadexyz.gitbook.io/bluespade/referrals", external: true },
//     { text: t`Media Kit`, link: "https://bluespadexyz.gitbook.io/bluespade/", external: true },
//     // { text: "Jobs", link: "/jobs", isAppLink: true },
//   ],
//   app: [
//     { text: t`Terms and Conditions`, link: "/terms-and-conditions" },
//     { text: t`Referral Terms`, link: "/referral-terms" },
//     { text: t`Media Kit`, link: "https://bluespadexyz.gitbook.io/bluespade/", external: true },
//     // { text: "Jobs", link: "/jobs" },
//   ],
// };

const socialLinks = [
  { link: "https://twitter.com/Blue__Spade", name: "Twitter", icon: twitterIcon },
  { link: "https://discord.gg/bluespade", name: "Discord", icon: discordIcon },
  { link: "https://t.me/BlueSpadexyz", name: "Telegram", icon: telegramIcon },
  { link: "https://bluespade.medium.com/", name: "Medium", icon: mediumIcon },
  // { link: "https://bluespadexyz.gitbook.io/bluespade", name: "Gitbook", icon: gitbookIcon },
  // { link: "https://github.com/Bluespadexyz", name: "Github", icon: githubIcon },
];

type Props = { showRedirectModal?: (to: string) => void; redirectPopupTimestamp?: () => void };

export default function Footer({ showRedirectModal, redirectPopupTimestamp }: Props) {
  const isHome = isHomeSite();
  const isMobile = useMedia("(max-width: 650px)");

  return (
    <div className="Footer">
      <div className={cx("Footer-wrapper", { home: isHome })}>
        {
          !isMobile ?
            <>
              <div className="Footer-social">
                <h1 className="Footer-title">Join Us</h1>
                <div className="Footer-social-link-block">
                  {socialLinks.map((platform) => {
                    return (
                      <a
                        key={platform.name}
                        className="App-social-link"
                        href={platform.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={platform.icon} alt={platform.name} />
                      </a>
                    );
                  })}
                </div>
              </div>
              <div className="Footer-divider" />
            </>
            :
            <>
              <div className="Footer-social">
                <h1 className="Footer-title">Join Us</h1>
                <div className="Footer-divider" />
                <div className="Footer-social-link-block">
                  {socialLinks.map((platform) => {
                    return (
                      <a
                        key={platform.name}
                        className="App-social-link"
                        href={platform.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={platform.icon} alt={platform.name} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </>
        }

      </div>
    </div>
  );
}
